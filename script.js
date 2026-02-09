let trainees = JSON.parse(localStorage.getItem("trainees")) || [];
let records = JSON.parse(localStorage.getItem("records")) || [];

function save() {
    localStorage.setItem("trainees", JSON.stringify(trainees));
    localStorage.setItem("records", JSON.stringify(records));
}

function addTrainee() {
    const name = nameInput.value.trim();
    if (!name || trainees.includes(name)) return;

    trainees.push(name);
    nameInput.value = "";
    save();
    renderSelect();
}

function renderSelect() {
    traineeSelect.innerHTML = "";
    trainees.forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        traineeSelect.appendChild(opt);
    });
}

function markAttendance(status) {
    const name = traineeSelect.value;
    const date = attendanceDate.value;

    if (!name) return alert("اختر المتربص");
    if (!date) return alert("اختر التاريخ");

    records.push({ name, status, date });
    save();
    renderHistory();
    updateStats();
}

function renderHistory() {
    history.innerHTML = "";

    records.slice().reverse().forEach((r, index) => {
        const li = document.createElement("li");
        li.className = r.status === "حاضر" ? "present" : "absent";

        li.innerHTML = `
            <span>${r.name} - ${r.status} (${r.date})</span>
            <button onclick="toggleStatus(${records.length - 1 - index})">تعديل</button>
        `;

        history.appendChild(li);
    });
}

function toggleStatus(i) {
    records[i].status = records[i].status === "حاضر" ? "غائب" : "حاضر";
    save();
    renderHistory();
    updateStats();
}

function updateStats() {
    const present = records.filter(r => r.status === "حاضر").length;
    const absent = records.filter(r => r.status === "غائب").length;
    const total = present + absent;

    presentCount.textContent = present;
    absentCount.textContent = absent;
    attendanceRate.textContent = total ? Math.round((present / total) * 100) + "%" : "0%";
}

function deleteTrainee() {
    const name = traineeSelect.value;
    if (!name) return;

    trainees = trainees.filter(t => t !== name);
    records = records.filter(r => r.name !== name);

    save();
    renderSelect();
    renderHistory();
    updateStats();
}

function editTrainee() {
    const oldName = traineeSelect.value;
    if (!oldName) return;

    const newName = prompt("الاسم الجديد:", oldName);
    if (!newName) return;

    trainees = trainees.map(t => t === oldName ? newName : t);
    records.forEach(r => { if (r.name === oldName) r.name = newName; });

    save();
    renderSelect();
    renderHistory();
}

function exportToCSV() {
    if (records.length === 0) return alert("لا يوجد بيانات");

    let csv = "\uFEFFالاسم,الحالة,التاريخ\n";
    records.forEach(r => {
        csv += `${r.name},${r.status},${r.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "سجل_الحضور.csv";
    link.click();
}

renderSelect();
renderHistory();
updateStats();
