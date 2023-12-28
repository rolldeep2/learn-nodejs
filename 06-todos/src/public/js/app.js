const todoForm = document.querySelector('form');
const todoFormInput = todoForm.querySelector('input');
const todoFormButton = todoForm.querySelector('button');
const deleteSelectionButton = document.querySelector('.selection');
const deleteAllButton = document.querySelector('.all');
const todoList = document.querySelector('ul');

let todos = [];

const createTodo = (data) => {
  todos = [...todos, { ...data, isUpdate: false }];

  const li = document.createElement('li');
  const input = document.createElement('input');
  const span = document.createElement('span');
  const button = document.createElement('button');

  deleteAllButton.hidden = false;

  input.type = 'checkbox';
  input.checked = data.isComplete;

  input.addEventListener('click', async (event) => {
    try {
      const isComplete = event.target.checked;

      await axios.patch(`/todos/${data.id}/completion`, { isComplete });

      todos = todos.map((todo) => {
        return todo.id === data.id ? { ...todo, isComplete } : todo;
      });

      deleteSelectionButton.hidden = !todos.some((todo) => todo.isComplete);
    } catch (err) {
      console.error(err);
    }
  });

  span.innerText = data.content;

  span.addEventListener('click', (event) => {
    todos = todos.map((todo) => {
      return { ...todo, isUpdate: todo.id === data.id };
    });

    todoFormInput.value = event.target.innerText;
    todoFormButton.innerText = 'Update';
  });

  button.innerText = 'Delete';

  // await 비동기쓸때, try catch 사용
  button.addEventListener('click', async () => {
    try {
      await axios.delete(`/todos?ids=${data.id}`);

      todos = todos.filter((todo) => todo.id !== data.id);

      deleteSelectionButton.hidden = !todos.some((todo) => todo.isComplete);
      deleteAllButton.hidden = !todos.length;

      // 클로저
      todoList.removeChild(li);
    } catch (err) {
      console.error(err);
    }
  });

  li.appendChild(input);
  li.appendChild(span);
  li.appendChild(button);

  todoList.appendChild(li);
};

todoForm.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();

    const selectedTodo = todos.find((todo) => todo.isUpdate);

    const content = todoFormInput.value.trim();

    if (!selectedTodo && content) {
      const { data } = await axios.post('/todos', { content });

      createTodo(data);

      todoFormInput.value = '';
    }

    if (selectedTodo && content) {
      await axios.patch(`/todos/${selectedTodo.id}/content`, { content });

      const index = todos.findIndex((todo) => todo.id === selectedTodo.id);

      todos[index].content = content;

      todoFormInput.value = '';

      todoFormButton.innerText = 'Create';

      const span = todoList.childNodes[index].querySelector('span');

      span.innerText = content;
    }
  } catch (err) {
    console.error(err);
  }
});

deleteSelectionButton.addEventListener('click', async () => {
  try {
    const ids = todos.reduce((result, todo) => {
      return todo.isComplete ? [...result, todo.id] : result;
    }, []);

    await axios.delete(`/todos?ids=${ids.join(',')}`);

    const indexes = todos.reduce((result, todo, index) => {
      return ids.includes(todo.id) ? [index, ...result] : result;
    }, []);

    // indexes = [2,1,0]
    indexes.forEach((index) => {
      // todos = [{id:1, ...},{id:2, ...},{id:3, ...}]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      todos.splice(index, 1);
      // todos = [{id:1, ...},{id:2, ...}]

      // childrens = [li, li, li...] index 유지를 위해 뒤에서부터 지움.
      todoList.childNodes[index].remove();
    });

    deleteSelectionButton.hidden = !todos.some((todo) => todo.isComplete);

    deleteAllButton.hidden = !todos.length;
  } catch (err) {
    console.error(err);
  }
});

deleteAllButton.addEventListener('click', async () => {
  try {
    await axios.delete('/todos');

    todos = [];

    deleteSelectionButton.hidden = true;

    deleteAllButton.hidden = true;

    todoList.innerHTML = '';
  } catch (err) {
    console.error(err);
  }
});

const app = async () => {
  try {
    const { data } = await axios.get('/todos');

    data.todos.forEach((todo) => {
      createTodo(todo);
    });

    // some : 배열에 하나라도 true 일 때 true a.some(a => !a) : 하나라도 false인 것 을 찾음(true)
    // every : 배열 전체가 true일 때 true
    deleteSelectionButton.hidden = !todos.some((todo) => todo.isComplete);
  } catch (err) {
    console.error(err);
  }
};

app();
