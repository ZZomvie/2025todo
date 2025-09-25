window.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".inputList input");
  const addBtn = document.getElementById("getValBtn");
  const inputList = document.querySelector(".inputList");
  const listAll = document.querySelector(".listAll");
  const sect2 = document.getElementById("sect2");
  const clearAllBtn = document.querySelector("#sect3 .long_btn");

  // 취소 버튼 생성
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "취소";
  cancelBtn.style.display = "none";
  cancelBtn.id = "cancelBtn";
  addBtn.insertAdjacentElement("afterend", cancelBtn);

  let editIndex = null; // 수정 중인 인덱스 저장

  // 로컬스토리지에서 할 일 가져오기
  function getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
  }

  // 로컬스토리지에 저장
  function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // 리스트 렌더링
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
        <span class="ListTit ${todo.checked ? "checked" : ""}">${
        todo.text
      }</span>
        <div class="icons">
          <div>
            <input type="checkbox" id="checker${index}" ${
        todo.checked ? "checked" : ""
      }/>
            <label for="checker${index}"></label>
          </div>
          <div>
            <img src="img/edit_color.png" alt="edit" class="editBtn" data-index="${index}" />
          </div>
          <div>
            <img src="img/delete.png" alt="delete" class="deleteBtn" data-index="${index}" />
          </div>
        </div>
      `;
      listAll.appendChild(li);
    });
  }

  // 추가 / 수정
  function addOrEditTodo() {
    const text = input.value.trim();
    if (!text) return;

    const todos = getTodos();

    if (editIndex !== null) {
      if (todos[editIndex].checked) {
        alert("완료된 항목은 수정할 수 없습니다.");
        return;
      }
      todos[editIndex].text = text;
      editIndex = null;
      addBtn.textContent = "추가";
      cancelBtn.style.display = "none";
      inputList.classList.remove("editing"); // 수정 완료 후 클래스 제거
    } else {
      todos.push({ text, checked: false });
    }

    input.value = "";
    saveTodos(todos);
    renderTodos();
  }

  // 삭제
  function deleteTodo(index) {
    const todos = getTodos();
    if (todos[index].checked) {
      alert("완료된 항목은 삭제할 수 없습니다.");
      return;
    }
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
  }

  // 수정 (input에서)
  function editTodo(index) {
    const todos = getTodos();
    if (todos[index].checked) {
      alert("완료된 항목은 수정할 수 없습니다.");
      return;
    }
    input.value = todos[index].text;
    editIndex = index;
    addBtn.textContent = "수정 완료";
    cancelBtn.style.display = "inline-block";
    inputList.classList.add("editing"); // 수정 중 클래스 추가
    input.focus();
  }

  // 수정 취소
  function cancelEdit() {
    editIndex = null;
    input.value = "";
    addBtn.textContent = "추가";
    cancelBtn.style.display = "none";
    inputList.classList.remove("editing"); // 클래스 제거
  }

  // 체크 토글
  function toggleCheck(index) {
    const todos = getTodos();
    todos[index].checked = !todos[index].checked;
    saveTodos(todos);
    renderTodos();
  }

  // 전체 삭제 (체크된 항목 남김)
  function clearAll() {
    const todos = getTodos();
    const remaining = todos.filter((todo) => todo.checked);
    saveTodos(remaining);
    renderTodos();
  }

  // 이벤트
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addOrEditTodo();
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cancelEdit();
  });

  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") addOrEditTodo();
  });

  listAll.addEventListener("click", (e) => {
    const target = e.target;
    const index = target.dataset.index;
    if (!index) return;

    if (target.classList.contains("deleteBtn")) {
      if (editIndex !== null) {
        alert("수정 중에는 삭제할 수 없습니다.");
        return; // 수정 중이면 삭제 금지
      }
      deleteTodo(index);
    } else if (target.classList.contains("editBtn")) {
      editTodo(index);
    }
  });
  // 체크박스 토글 (수정 중이면 체크/해제 금지)
  listAll.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") {
      if (editIndex !== null) {
        e.preventDefault(); // 체크 상태 변경 막기
        alert("수정 중에는 체크를 변경할 수 없습니다.");
        renderTodos(); // 원래 상태로 복귀
        return;
      }
      const index = e.target.id.replace("checker", "");
      toggleCheck(index);
    }
  });
  clearAllBtn.addEventListener("click", (e) => {
    if (editIndex !== null) {
      alert("수정 중에는 전체 삭제할 수 없습니다.");
      return; // 수정 중이면 전체 삭제 금지
    }
    clearAll();
  });

  renderTodos();
});
