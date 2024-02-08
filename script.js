;(function () {
  'use strict'
  const API_URI = "http://localhost:3000/todos";
  const get = (target) => {
    return document.querySelector(target)
  }

  const $todos = get('.todos');
  const $form = get('.todo_form');
  const $todoInput = get('.todo_input');
  const $pagination = get('.pagination');

  const limit = 5;
  let currentPage = 1;
  const totalCount = 21;
  const pageCount = 4;

  const pagination = () => {
    let totalPage = Math.ceil(totalCount / limit);
    let pageGroup = Math.ceil(currentPage / pageCount);
    let lastNumber = pageGroup * pageCount;
    if (lastNumber > totalPage) lastNumber = totalPage;
    let firstNumber = lastNumber - (pageCount - 1);
    const next = lastNumber + 1;
    const prev = firstNumber - 1;
    let html = '';
    if (prev > 0) {
      html += `<button class="prev" data-fn="prev">이전</button>`;
    }
    for (let i = firstNumber; i <= lastNumber; i++) {
      html += `<button class="pageNumber" id="page_${i}">${i}</button>`;
    }
    if (lastNumber < totalPage) {
      html += `<button class="next" data-fn="next">다음</button>`;
    }
    $pagination.innerHTML = html;
    const $currentPageNumber = get(`.pageNumber#page_${currentPage}`);
    $currentPageNumber.style.color = '#9dc0c9';

    const $currentPageNumbers = document.querySelectorAll('.pagination button');
    $currentPageNumbers.forEach(button => {
      button.addEventListener('click', () => {
        if (button.dataset.fn === 'prev') {
          currentPage = prev;
        } else if (button.dataset.fn === 'next') {
          currentPage = next;
        } else {
          currentPage = button.innerText;
        }
        pagination();
        getTodos();
      })
    })
    

  }

  const createTodoElement = (item) => {
    const { id, completed, content } = item
    const $todoItem = document.createElement('div')
    const isChecked = completed ? 'checked' : "";
    $todoItem.classList.add('item')
    $todoItem.dataset.id = id
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox'
                ${isChecked}
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
    $todos.innerHTML = "";
    dataList.forEach((todo) => {
      $todos.appendChild(createTodoElement(todo));
    });
  }

  const getTodos = () => {
    fetch(`${API_URI}?_page=${currentPage}&_per_page=${limit}`)
      .then((response) => response.json())
      .then((json) => renderTodos(json.data))
      .catch((error) => console.error(error));
  }



  const addTodo = (e) => {
    e.preventDefault();
    const todo = {
      content: $todoInput.value,
      completed: false,
    };
    
    fetch(API_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
      .then(getTodos)
      .then(() => {
        $todoInput.value = "";
        $todoInput.focus();
      })
      .catch((error) => console.error(error))
  }

  const toggleTodo = (e) => {
    if (e.target.className !== "todo_checkbox") return;
    const $item = e.target.closest('.item');
    const id = $item.dataset.id;
    const completed = e.target.checked;
    
    fetch(`${API_URI}/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed })
    })
      .then(getTodos)
      .catch((error) => console.error(error));

  }

  const changeEditMode = (e) => {
    if (e.target.className !== 'todo_edit_button') return;
    const $item = e.target.closest('.item');
    const $contentButtons = $item.querySelector('.content_buttons');
    const $editButtons = $item.querySelector('.edit_buttons');
    const $label = $item.querySelector('label');
    const $input = $item.querySelector('input[type="text"]');
    
    $contentButtons.style.display = "none";
    $label.style.display = "none";
    $editButtons.style.display = "block";
    $input.style.display = "block";
    $input.focus();
    $input.value = "";
    $input.value = $label.innerHTML;
  }

  const updateTodo = (e) => {
    if (e.target.className !== 'todo_edit_confirm_button') return;
    const $item = e.target.closest('.item');
    const $contentButtons = $item.querySelector('.content_buttons');
    const $editButtons = $item.querySelector('.edit_buttons');
    const $input = $item.querySelector('input[type="text"]');
    const $label = $item.querySelector('label');
    const id = $item.dataset.id;
    if ($input.value === $label.innerHTML) return;
    const content = $input.value;
    fetch(`${API_URI}/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    })
      .then(getTodos)
      .catch((error) => console.error(error));
    $contentButtons.style.display = "block";
    $label.style.display = "block";
    $editButtons.style.display = "none";
    $input.style.display = "none";
    $label.innerHTML = $input.value;
  }

  const cancelEditMode = (e) => {
    if (e.target.className !== 'todo_edit_cancel_button') return;
    const $item = e.target.closest('.item');
    const $contentButtons = $item.querySelector('.content_buttons');
    const $editButtons = $item.querySelector('.edit_buttons');
    const $label = $item.querySelector('label');
    const $input = $item.querySelector('input[type="text"]');

    $contentButtons.style.display = "block";
    $label.style.display = "block";
    $editButtons.style.display = "none";
    $input.style.display = "none";
    $input.value = $label.innerHTML;
  }

  const deleteTodo = (e) => {
    if (e.target.className !== "todo_remove_button") return;
    const $item = e.target.closest('.item');
    const id = $item.dataset.id;
    fetch(`${API_URI}/${id}`, {
      method: "DELETE"
    })
      .then(getTodos);
  }

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
      pagination();
    })
    $form.addEventListener('submit', (e) => {
        addTodo(e);
    });
    $todos.addEventListener('click', (e) => {
      toggleTodo(e);
    });
    $todos.addEventListener('click', (e) => {
      changeEditMode(e);
    });
    $todos.addEventListener('click', (e) => {
      updateTodo(e);
    });
    $todos.addEventListener('click', (e) => {
      cancelEditMode(e);
    });
    $todos.addEventListener('click', (e) => {
      deleteTodo(e);
    })
  }
  init()
})()
