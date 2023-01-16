# type: ignore
from behave import *
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
import time
import random


def buscar_livros(context):
    context.browser.find_element(By.ID, 'search').send_keys(
        'mais lidos ' + random.randint(1, 1000).__str__())
    context.browser.find_element(By.XPATH, '//button[text()="Buscar"]').click()


def login(context):
    context.browser.find_element(By.ID, 'email').send_keys("test@test.com")
    context.browser.find_element(By.ID, 'password').send_keys('123456')
    context.browser.find_element(By.ID, 'password').send_keys(Keys.RETURN)


@given('que eu esteja na pagina principal')
def step_impl(context):
    context.browser.get('http://localhost/signin')
    login(context)
    time.sleep(1)


@then('eu devo viasualizar uma lista de livros')
def step_impl(context):
    time.sleep(1)
    buscar_livros(context)

    time.sleep(5)


@when(u'eu clicar no botão "Detalhes"')
def step_impl(context):
    buscar_livros(context)
    time.sleep(3)
    buttons = context.browser.find_elements(By.TAG_NAME, 'button')
    buttons[2].click()


@then(u'eu devo viasualizar os detalhes do livro')
def step_impl(context):
    time.sleep(2)
    context.browser.find_element(By.XPATH, '//div[text()="Número de páginas"]')


@given(u'que eu esteja com os detalhes do livro aberto')
def step_impl(context):
    time.sleep(1)
    context.browser.find_element(
        By.XPATH, '//button[text()="Marcar como lido"]')


@when(u'eu clicar no botão "Marcar como lido"')
def step_impl(context):
    time.sleep(2)
    context.browser.find_element(
        By.XPATH, '//button[text()="Marcar como lido"]').click()


@then(u'eu devo viasualizar o livro marcado com "Já li"')
def step_impl(context):
    time.sleep(5)
    context.browser.find_element(By.XPATH, '//button[text()="Já li"]')
