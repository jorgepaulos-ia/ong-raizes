/*
 * Máscaras de preenchimento do formulário de cadastro.
 * A validação de formato continua sendo feita pelo HTML (atributos
 * required e pattern); este script apenas formata a digitação e
 * confere os dígitos verificadores do CPF.
 */

function somenteDigitos(valor) {
  return valor.replace(/\D/g, '');
}

function mascaraCPF(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraTelefone(valor) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function mascaraCEP(valor) {
  return somenteDigitos(valor)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

// Confere os dois dígitos verificadores do CPF (algoritmo da Receita Federal).
function cpfValido(cpf) {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  for (let pos = 9; pos <= 10; pos++) {
    let soma = 0;
    for (let i = 0; i < pos; i++) {
      soma += Number(d[i]) * (pos + 1 - i);
    }
    const digito = (soma * 10) % 11 % 10;
    if (digito !== Number(d[pos])) return false;
  }
  return true;
}

function aplicarMascara(id, mascara) {
  const campo = document.getElementById(id);
  campo.addEventListener('input', () => {
    campo.value = mascara(campo.value);
  });
}

aplicarMascara('cpf', mascaraCPF);
aplicarMascara('telefone', mascaraTelefone);
aplicarMascara('cep', mascaraCEP);

// Integra a checagem do CPF à validação nativa do navegador.
const campoCPF = document.getElementById('cpf');
campoCPF.addEventListener('input', () => {
  const completo = campoCPF.value.length === 14;
  campoCPF.setCustomValidity(
    completo && !cpfValido(campoCPF.value) ? 'CPF inválido. Confira os números digitados.' : ''
  );
});

// Projeto acadêmico: não envia dados a nenhum servidor.
document.querySelector('.formulario').addEventListener('submit', (evento) => {
  evento.preventDefault();
  alert('Cadastro validado com sucesso! (Simulação: nenhum dado foi enviado.)');
  evento.target.reset();
});
