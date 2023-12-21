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

  button.innerText = 'Delete';

  li.appendChild(input);
  li.appendChild(span);
  li.appendChild(button);

  todoList.appendChild(li);
};

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
