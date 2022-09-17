from behave import use_fixture

from features.fixtures import selenium_browser_chrome


def before_all(context):
    use_fixture(selenium_browser_chrome, context)
