package assigment.sol;

import java.util.List;



import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.server.handler.SendKeys;
import org.openqa.selenium.support.ui.Select;

import com.dell.acoe.framework.selenium.verify.Assert;


public class assinment {
	static WebDriver driver;
	
	public static void main(String[] args) {
		//Setting up the driver property
		System.setProperty("webdriver.chrome.driver", "C://Users//A152TSO//Downloads//chromedriver_win32 (6)//chromedriver.exe");
		
		driver = new ChromeDriver();
		//launching the url or Wiki link
		try {
		driver.get("https://www.riproviderportal.org/hcp/provider/Home/tabid/135/Default.aspx");
		} catch (Exception e) {
	    	   
	    	   
			Assert.error(e, "Not a valid link");
			
		
		}
		}

}
