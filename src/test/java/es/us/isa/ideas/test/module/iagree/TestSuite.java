package es.us.isa.ideas.test.module.iagree;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;

/**
 * iAgree languages module TestSuite
 * 
 * @author feserafim
 */

@RunWith(Suite.class)
@Suite.SuiteClasses({
	TC01_Login.class,
	TC02_IAgreeAgreementTestModule.class,
	TC03_IAgreeOfferTestModule.class,
	TC04_IAgreeTemplateTestModule.class
})
public class TestSuite extends es.us.isa.ideas.test.utils.TestCase {

	private static final Logger LOG = Logger.getLogger(TestSuite.class
			.getName());

	@BeforeClass
	public static void setUp() {
		LOG.log(Level.INFO, "Starting iAgree languages module TestSuite...");
	}

	@AfterClass
	public static void tearDown() throws InterruptedException {
		
		logout();
		getWebDriver().close();
		
		LOG.log(Level.INFO, "Login iAgree languages module finished");
		
	}
	
}
	
	