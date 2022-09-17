# type: ignore
from behave import *
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

@given('Um cliente na pagina de login')
def step_impl(context):  
    context.browser.get('http://localhost/signin')
    time.sleep(1)

@when('o cliente faz o login com "{email}" e "{senha}"')
def step_impl(context, email, senha):
    context.browser.find_element(By.ID, 'email').send_keys(email)
    time.sleep(2)
    context.browser.find_element(By.ID, 'password').send_keys(senha)
    time.sleep(2)
    context.browser.find_element(By.ID, 'password').send_keys(Keys.RETURN)
    time.sleep(2)


@then('ele deve ser redireciona para a listagem de livros')
def step_impl(context):
    assert context.browser.current_url == 'http://localhost/' , f'URL atual: {context.browser.current_url}'


