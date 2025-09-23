// main.js

window.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".inputList input");
  const addBtn = document.getElementById("getValBtn");
  const listAll = document.querySelector(".listAll");
  const sect2 = document.getElementById("sect2");
  const clearAllBtn = document.querySelector("#sect3 .long_btn");

  // 로컬스토리지에서 할 일 가져오기
  function getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
  }

  // 로컬스토리지에 저장
  function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // 화면에 리스트 출력
  function renderTodos() {
    const todos = getTodos();
    listAll.innerHTML = "";

    if (todos.length === 0) {
      sect2.style.display = "none";
      return;
    }

    sect2.style.display = "flex";

    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.className = "list";
      li.innerHTML = `
        <span class="ListTit">${todo.text}</span>
        <div class="icons">
          <div>
            <input type="checkbox" id="checker${index}" ${
        todo.checked ? "checked" : ""
      }/>
            <label for="checker${index}"></label>
          </div>
          <div><img src="img/edit_color.png" alt="edit" class="editBtn" data-index="${index}" /></div>
          <div><img src="img/delete.png" alt="delete" class="deleteBtn" data-index="${index}" /></div>
        </div>
      `;

      listAll.appendChild(li);
    });
  }

  // 할 일 추가
  function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    const todos = getTodos();
    todos.push({ text: text, checked: false });
    saveTodos(todos);

    input.value = "";
    renderTodos();
  }

  // 할 일 삭제
  function deleteTodo(index) {
    const todos = getTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
  }

  // 할 일 수정
  function editTodo(index) {
    const todos = getTodos();
    const newText = prompt("수정할 내용을 입력하세요:", todos[index].text);
    if (newText !== null && newText.trim() !== "") {
      todos[index].text = newText.trim();
      saveTodos(todos);
      renderTodos();
    }
  }

  // 체크박스 토글
  function toggleCheck(index) {
    const todos = getTodos();
    todos[index].checked = !todos[index].checked;
    saveTodos(todos);
    renderTodos();
  }

  // 전체 삭제
  function clearAll() {
    localStorage.removeItem("todos");
    renderTodos();
  }

  // 이벤트 등록
  addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    addTodo();
  });

  // 엔터키로 추가
  input.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  // 삭제, 수정, 체크 이벤트 (이벤트 위임)
  listAll.addEventListener("click", function (e) {
    const target = e.target;
    const index = target.dataset.index;

    if (target.classList.contains("deleteBtn")) {
      deleteTodo(index);
    } else if (target.classList.contains("editBtn")) {
      editTodo(index);
    }
  });

  // 체크박스 토글 (위임)
  listAll.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") {
      const index = e.target.id.replace("checker", "");
      toggleCheck(index);
    }
  });

  // 전체 삭제 버튼
  clearAllBtn.addEventListener("click", clearAll);

  // 초기 렌더링
  renderTodos();
});
