;(function () {
  'use strict'

  const $todos = document.querySelector('.todos');
  const get = (target) => {
    return document.querySelector(target)
  }

  const createTodoElement = (item) => {
    const { id, content } = item
    const $todoItem = document.createElement('div')
    $todoItem.classList.add('item')
    $todoItem.dataset.id = id
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem
  }
  
  const renderTodos = (dataList) => {
    dataList.forEach((todo) => {
      $todos.appendChild(createTodoElement(todo));
    });
  }

  const getTodos = () => {
    fetch('http://localhost:3000/todos')
      .then((response) => response.json())
      .then((json) => renderTodos(json))
      .catch((error) => console.error(error));
  }
  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
    })
  }
  init()
})()
