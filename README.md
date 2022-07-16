# Software QA Assessment

## Steps to execute the application

- Clone the repository

- Make sure that `node.js` and `npm` are installed, by running the below commands:

  ```bash
  node -v
  # v18.5.0

  npm -v
  # 8.13.2
  ```

- Install all the required node modules:

  ```bash
  npm install
  ```

- To scrap the a website, pass its URL as an argument to `index.js` script, as shown below:

  ```bash
  node index.js --url https://en.wikipedia.org/wiki/Cricket
  ```

- Optionally pass the number of cycles (default: 1):

  ```bash
  node index.js --cycles 2 --url https://en.wikipedia.org/wiki/Cricket
  ```

- Results will be saved in a file called `results.json` in the current directory
