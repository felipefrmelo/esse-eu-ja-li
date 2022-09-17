from behave import fixture
from selenium import webdriver

@fixture
def selenium_browser_chrome(context):
    # -- HINT: @behave.fixture is similar to @contextlib.contextmanager
    context.browser = webdriver.Chrome()
    ## setup the size of the browser window
    context.browser.maximize_window()
    yield context.browser
    # -- CLEANUP-FIXTURE PART:
    context.browser.quit()


