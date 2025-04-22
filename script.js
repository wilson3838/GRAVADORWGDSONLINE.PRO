// Proteção para a página principal
window.onload = function () {
    if (window.location.pathname.includes("programa_completo.html")) {
        const autenticado = sessionStorage.getItem("logado");
        if (!autenticado) {
            window.location.href = "index.html";
        }
    }
};

// Login do administrador (corrigido: não entra automático)
function logarComoAdmin() {
    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value.trim();

    if (user === "admin" && pass === "admin123") {
        sessionStorage.setItem("logado", "admin");
        window.location.href = "programa_completo.html";
    } else {
        alert("Login ou senha do administrador incorretos.");
    }
}

// Login do usuário (já estava certo)
function logarComoUsuario() {
    const user = document.getElementById("userUser").value.trim();
    const pass = document.getElementById("userPass").value.trim();

    if (user === "usuario" && pass === "senha123") {
        sessionStorage.setItem("logado", "usuario");
        window.location.href = "programa_completo.html";
    } else {
        alert("Login ou senha do usuário incorretos.");
    }
}

// Captura e gravação
let stream;
let mediaRecorder;
let gravando = false;

function iniciarCaptura() {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(s => {
            stream = s;
            const preview = document.getElementById("preview");
            if (preview) {
                preview.srcObject = stream;
                preview.play();
            }
        })
        .catch(e => alert("Erro ao capturar: " + e));
}

function iniciarGravacao() {
    if (!stream) return alert("Inicie a captura primeiro!");

    mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "gravacao.webm";
        a.click();
    };

    mediaRecorder.start();
    gravando = true;
    iniciarCronometro();
}

function encerrarGravacao() {
    if (mediaRecorder && gravando) {
        mediaRecorder.stop();
        gravando = false;
        pararCronometro();
    }
}

// Relógio em tempo real
setInterval(() => {
    const agora = new Date();
    const horaAtual = document.getElementById("horaAtual");
    if (horaAtual) {
        horaAtual.innerText = agora.toLocaleTimeString();
    }
}, 1000);

// Cronômetro
let tempo = 0;
let cronometroInterval;

function iniciarCronometro() {
    cronometroInterval = setInterval(() => {
        tempo++;
        const minutos = Math.floor(tempo / 60);
        const segundos = tempo % 60;
        const cronometro = document.getElementById("cronometro");
        if (cronometro) {
            cronometro.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function pararCronometro() {
    clearInterval(cronometroInterval);
    tempo = 0;
}
