from behave import fixture
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@fixture
def selenium_browser_chrome(context):
    # -- HINT: @behave.fixture is similar to @contextlib.contextmanager
    service = Service(executable_path=ChromeDriverManager().install())
    context.browser = webdriver.Chrome(service=service)
    ## setup the size of the browser window
    context.browser.maximize_window()
    yield context.browser
    # -- CLEANUP-FIXTURE PART:
    context.browser.quit()


