# type: ignore
from behave import *
from selenium.webdriver.common.by import By
import time

@given('que eu esteja na pagina principal')
def step_impl(context):
    context.browser.get('http://localhost')


@then('eu devo viasualizar uma lista de livros')
def step_impl(context):
    time.sleep(1)
    context.browser.find_element(By.ID, 'search').send_keys('mais lidos')

    context.browser.find_element(By.XPATH, '//button[text()="Buscar"]').click()

    time.sleep(5)


