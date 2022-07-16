const puppeteer = require("puppeteer");
const options = require("./config");
const args = require("minimist")(process.argv.slice(2), options);
const fs = require("fs/promises");

const isValidWikiURL = (str) => {
  let url;

  // Check if the string is a valid URL
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  var http = url.protocol === "http:" || url.protocol === "https:";

  // Return true if the URL is a valid wiki page
  if (http && url.hostname.search(".wikipedia.org") !== -1) return true;

  return false;
};

const guardValidURL = (url) => {
  // Throw an error if the user provides an invalid Wiki URL
  if (!isValidWikiURL(url)) {
    throw new Error("Invalid Wikipedia link, please provide a valid Wikipedia link");
  }
};

const guardValidNumber = (n) => {
  const isValid = Number.isFinite(n) && n > 0 && n < 21;

  // Throw an error if the user did not provide a number
  // between 1 to 20
  if (!isValid)
    throw new Error("Invalid integer, please provide an integer between 1 to 20");
};

const scrapWikiLinks = async (url, page) => {
  // Goto the given URL
  await page.goto(url);

  // Extract all the links in the web page
  const links = await page.$$eval("a", (as) => as.map((a) => a.href));

  // Filter valid Wiki links
  const validLinks = links.filter((link) => isValidWikiURL(link));

  // Return URLs without hash
  return validLinks.map((a) => {
    const hashTrimmedURL = new URL(a);
    return `${hashTrimmedURL.origin}${hashTrimmedURL.pathname}`;
  });
};

const start = async (url, cycles) => {
  // Check if the URL is a valid Wiki URL
  // else throw an error
  guardValidURL(url);

  // Check if cycles is a number between 1 to 20
  // else throw an error
  guardValidNumber(cycles);

  // Launch Chromium in headless mode
  const browser = await puppeteer.launch();

  try {
    // Open new page
    const page = await browser.newPage();

    // Local variables to keep tack all the links found in a page
    // and current cycle
    let allWikiLinks,
      cycle = 0;

    // Initialize result object
    const result = {
      url,
      cycles,
      visited_links: new Set(),
      unique_links: { [cycle]: new Set([url]) },
      all_found_links: { [cycle]: [url] },
    };

    for (; cycle < cycles; cycle++) {
      result.all_found_links[cycle + 1] = [];
      result.unique_links[cycle + 1] = new Set();

      for (const subURL of result.unique_links[cycle]) {
        allWikiLinks = [];

        if (!result.visited_links.has(subURL)) {
          allWikiLinks = await scrapWikiLinks(subURL, page);

          await new Promise((r) => setTimeout(r, 1000));

          result.visited_links.add(subURL);

          result.all_found_links[cycle + 1] = [
            ...result.all_found_links[cycle + 1],
            ...allWikiLinks,
          ];

          result.unique_links[cycle + 1] = new Set([
            ...result.unique_links[cycle + 1],
            ...result.all_found_links[cycle + 1],
          ]);
        }
      }
    }

    // Initialize final data
    const finalData = {
      all_found_links: [],
      total_count: 0,
      unique_count: 0,
    };

    // Collate all links and calculate total links
    for (const key in result.all_found_links) {
      finalData.all_found_links.push(...result.all_found_links[key]);
      finalData.total_count += result.all_found_links[key].length;
    }

    // Calculate all unique links
    for (const key in result.unique_links) {
      finalData.unique_count += result.unique_links[key].size;
    }

    // Save results to disk in JSON format
    await fs.writeFile("results.json", JSON.stringify(finalData, null, 4), "utf8");

    // Close the page
    await page.close();
  } catch (error) {
    // Log errors
    console.log(error);
  } finally {
    await browser.close();
  }
};

// Start scrapping from the given link
start(args.url, args.cycles);
