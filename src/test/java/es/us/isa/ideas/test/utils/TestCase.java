package es.us.isa.ideas.test.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

/**
 * This class contains all necessary utilities to run IDEAS integration tests
 * with selenium.
 * 
 * @author feserafim
 */

public class TestCase {

	private static String seleniumPropFile = "selenium.properties";
	private static String applicationPropFile = "application.properties";
	private static final Logger LOG = Logger.getLogger(TestCase.class.getName());

	public static Properties getApplicationProperties() {
		Properties prop = null;

		try {
			prop = new Properties();
			InputStream input = TestCase.class.getResourceAsStream("/" + applicationPropFile);
			prop.load(input);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return prop;
	}

	public static String getSeleniumPropFile() {
		return seleniumPropFile;
	}

	/**
	 * Obtain the absolute path from a relative path.
	 * 
	 * @param path
	 * @return the absolute path string
	 */
	public static String getUrlAbsolute(String path) {
		String url = "";

		if (path.startsWith("/")) {
			url += SeleniumBuilder.getBaseUrl() + path;
		} else {
			url += SeleniumBuilder.getBaseUrl() + "/" + path;
		}

		return url;
	}

	/**
	 * Log to IDEAS using user and password properties defined in
	 * 'selenium.properties' file.
	 * 
	 * @return true if everything went well and a user has been logged
	 * @throws InterruptedException
	 */
	public static boolean login() throws InterruptedException {

		boolean ret = false;

		if (!IdeasStudioActions.isAnyUserLogged() && IdeasStudioActions.goLoginPage()) {

			waitForVisibleSelector("#username");

			SeleniumBuilder.getExpectedActions().sendKeys(By.id("username"), getSeleniumAutotesterUser());
			SeleniumBuilder.getExpectedActions().sendKeys(By.id("password"), getSeleniumAutotesterPassword());
			SeleniumBuilder.getExpectedActions().click(By.id("loginButton"));

			Thread.sleep(2000);

			ret = true; // TODO: make sure user really logged by calling
						// isAnyUserLogged again

		}

		return ret;

	}

	/**
	 * Logs into IDEAS application using a username and password.
	 * 
	 * @param username
	 * @param password
	 * @return true if user was redirect to editor page 'app/editor'
	 * @throws InterruptedException
	 */
	public static boolean loginWithParams(String username, String password) throws InterruptedException {

		boolean ret = false;

		TestCase.logout();

		if (IdeasStudioActions.goLoginPage()) {

			waitForVisibleSelector("#username");

			SeleniumBuilder.getExpectedActions().sendKeys(By.id("username"), username);
			SeleniumBuilder.getExpectedActions().sendKeys(By.id("password"), password);
			SeleniumBuilder.getExpectedActions().click(By.id("loginButton"));

			Thread.sleep(2000);

			ret = getCurrentUrl().contains("app/editor");

		}

		return ret;

	}

	/**
	 * Logout user by calling 'goLogoutPage()'.
	 * 
	 * @return true if everything gone fine and there is no user logged.
	 * @throws InterruptedException
	 */
	public static boolean logout() throws InterruptedException {

		boolean ret = IdeasStudioActions.goLogoutPage();
		// TODO: make sure user really logout by calling isAnyUserLogger()
		Thread.sleep(2000);

		return ret;

	}

	public static Properties getSeleniumProperties() {

		Properties prop = new Properties();
		InputStream input = null;

		try {
			String propFile = getSeleniumPropFile();
			input = TestCase.class.getResourceAsStream("/" + propFile);
			if (input != null) {
				prop.load(input);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return prop;
	}

	public static String getSeleniumAutotesterUser() {
		return getSeleniumProperties().getProperty("test.autotester.user");
	}

	public static String getSeleniumAutotesterPassword() {
		return getSeleniumProperties().getProperty("test.autotester.pass");
	}

	public static String getSeleniumUserName() {
		return getSeleniumProperties().getProperty("test.user.name");
	}

	public static String getSeleniumUserEmail() {
		return getSeleniumProperties().getProperty("test.user.email");
	}

	public static String getSeleniumUserPhone() {
		return getSeleniumProperties().getProperty("test.user.phone");
	}

	public static String getSeleniumUserAddress() {
		return getSeleniumProperties().getProperty("test.user.address");
	}

	public static String getSeleniumTwitterUser() {
		return getSeleniumProperties().getProperty("test.tw.user");
	}

	public static String getSeleniumTwitterPasswd() {
		return getSeleniumProperties().getProperty("test.tw.pass");
	}

	public static String getSeleniumGoogleUser() {
		return getSeleniumProperties().getProperty("test.go.user");
	}

	public static String getSeleniumGooglePasswd() {
		return getSeleniumProperties().getProperty("test.go.pass");
	}

	public static String getSeleniumGithubUser() {
		return getSeleniumProperties().getProperty("test.gi.user");
	}

	public static String getSeleniumGithubPasswd() {
		return getSeleniumProperties().getProperty("test.gi.pass");
	}

	public static String getCurrentUrl() {
		return SeleniumBuilder.getWebDriver().getCurrentUrl();
	}

	public static String getStatusCode(String url) throws InterruptedException {

		String ret = "";

		if (loadSeleniumJQuery()) {

			Object statusCode = (Object) getJs().executeScript("var res=null;" + "jQuery.ajax({" + "url: '" + url + "',"
					+ "data: {}," + "async: false," + "complete: function(xhr, statusText){" + "res = xhr.status;" + "}"
					+ "});" + "return res;");

			if (statusCode != null)
				ret += statusCode.toString();

		}

		return ret;

	}

	public static String getCurrentPageStatusCode() throws IOException, InterruptedException {
		return getStatusCode(getCurrentUrl());
	}

	/**
	 * Loads /js/vendor/jquery.js file into selenium webdriver.
	 * 
	 * @return true if jquery was successfully loaded into webdriver.
	 * @throws InterruptedException
	 */
	public static boolean loadSeleniumJQuery() throws InterruptedException {

		boolean ret = false;

		// load jquery.js
		getJs().executeScript("var s=window.document.createElement('script');" + "s.src='"
				+ getUrlAbsolute("js/vendor/jquery.js") + "';" + "window.document.head.appendChild(s);");

		Thread.sleep(150); // time necessary to reload DOM

		Object o = (Object) SeleniumBuilder.getJs().executeScript("$ ? true:false;");

		if (o != null) {
			ret = (Boolean) o;

			if (!ret)
				LOG.severe("Couldn\'t load jquery.js into Selenium WebDriver");

		}

		return ret;

	}

	public static String getSeleniumServerBaseURL() {
		String url = getSeleniumProperties().getProperty("test.server.baseURL");

		if (url.endsWith("/")) {
			url = url.substring(0, url.length() - 1);
		}

		return url;
	}

	public static String getSeleniumServerPort() {
		return getSeleniumProperties().getProperty("test.server.port");
	}

	public static String getSeleniumAppName() {
		return getSeleniumProperties().getProperty("test.app.name");
	}

	public static String getTextSelector(String cssSelector) {
		return SeleniumBuilder.getWebDriver().findElement(By.cssSelector(cssSelector)).getText();
	}

	public static String getInputValueSelector(String cssSelector) {
		return getWebDriver().findElement(By.cssSelector(cssSelector)).getAttribute("value");
	}

	public static String getBaseUrl() {
		return SeleniumBuilder.getBaseUrl();
	}

	public static WebDriver getWebDriver() {
		return SeleniumBuilder.getWebDriver();
	}

	public static ExpectedActions getExpectedActions() {
		return SeleniumBuilder.getExpectedActions();
	}

	public static JavascriptExecutor getJs() {
		return SeleniumBuilder.getJs();
	}

	public static ExpectedActions waitForVisibleSelector(String selector) {
		SeleniumBuilder.getWait().until(ExpectedConditions.elementToBeClickable(By.cssSelector(selector)));

		return getExpectedActions();
	}

	public static boolean validatePropertyValues(String... propValues) {
		boolean ret = true;

		for (String value : propValues) {
			ret = ret && value != null && !"".equals(value);
			if (!ret)
				break;
		}

		return ret;
	}

	public static boolean isCurrentUrlContains(String s) throws InterruptedException {
		Thread.sleep(1000);
		return getCurrentUrl().contains(s);
	}

	public static void echoCommandApi(String msg) {

		try {
			TestCase.getJs().executeScript(
					"" + "if (CommandApi.echo) {" + "CommandApi.echo('IDT-console: " + msg + "');" + "}");

			Thread.sleep(3000);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public static int getSelectorLength(String selector) {

		Integer ret = 0;

		try {

			Object jsObj = TestCase.getJs().executeScript("return jQuery('" + selector + "').length;");
			Long content = 0L;
			if (jsObj != null) {
				content = (Long) jsObj;
				ret = content.intValue();
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return ret;
	}

}
