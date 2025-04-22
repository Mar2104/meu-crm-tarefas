const form = document.getElementById("form-tarefa");
const lista = document.getElementById("lista-tarefas");
const busca = document.getElementById("busca");
const exportar = document.getElementById("exportar");
const exportarExcel = document.getElementById("exportar-excel");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizar() {
  lista.innerHTML = "";
  const termo = busca.value.toLowerCase();
  tarefas
    .filter(tarefa =>
      tarefa.titulo.toLowerCase().includes(termo) ||
      tarefa.descricao.toLowerCase().includes(termo)
    )
    .forEach((tarefa, index) => {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = tarefa.concluida;
      checkbox.addEventListener("change", () => {
        tarefas[index].concluida = !tarefas[index].concluida;
        salvar();
        renderizar();
      });

      const span = document.createElement("span");
      span.innerHTML = `<strong>${tarefa.titulo}</strong>: ${tarefa.descricao}`;

      const btn = document.createElement("button");
      btn.textContent = "Excluir";
      btn.addEventListener("click", () => {
        tarefas.splice(index, 1);
        salvar();
        renderizar();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(btn);
      lista.appendChild(li);
    });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  tarefas.push({ titulo, descricao, concluida: false });
  salvar();
  renderizar();
  form.reset();
});

busca.addEventListener("input", renderizar);

exportar.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(tarefas, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tarefas.json";
  a.click();
  URL.revokeObjectURL(url);
});

exportarExcel.addEventListener("click", () => {
  if (tarefas.length === 0) {
    alert("Nenhuma tarefa para exportar.");
    return;
  }

  const dados = tarefas.map(tarefa => ({
    Título: tarefa.titulo,
    Descrição: tarefa.descricao,
    Concluída: tarefa.concluida ? "Sim" : "Não"
  }));

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tarefas");

  XLSX.writeFile(workbook, "tarefas.xlsx");
});

renderizar();
  