const TIPO_CASILLLA = {
  AGUA: 'A',
  MARGEN: 'M',
  PORTA_AVIONES: 'P',
  BUQUE: 'B',
  SUBMARINO: 'S',
  CRUCERO: 'C',
  LANCHA: 'L'
};

const TAMANYOS = {
  PORTA_AVIONES: 5,
  BUQUE: 4,
  SUBMARINO: 3,
  CRUCERO: 2,
  LANCHA: 1
};

const NOMBRES = {
  PORTA_AVIONES: 'Portaviones',
  BUQUE: 'Buque',
  SUBMARINO: 'Submarino',
  CRUCERO: 'Crucero',
  LANCHA: 'Lancha'
};

const HORIZONTAL = 'H';
const VERTICAL = 'V';

const POSICIONES = 100;
const COLUMNAS = 10;

const BARCOS = [
  {
    tipo: TIPO_CASILLLA.PORTA_AVIONES,
    orientacion: Math.floor(Math.random() * 100) > 49 ? HORIZONTAL : VERTICAL,
    intentos: 0,
    tamanyo: TAMANYOS.PORTA_AVIONES,
    nombre: NOMBRES.PORTA_AVIONES
  },
  {
    tipo: TIPO_CASILLLA.BUQUE,
    orientacion: Math.floor(Math.random() * 100) > 49 ? HORIZONTAL : VERTICAL,
    intentos: 0,
    tamanyo: TAMANYOS.BUQUE,
    nombre: NOMBRES.BUQUE
  },
  {
    tipo: TIPO_CASILLLA.SUBMARINO,
    orientacion: Math.floor(Math.random() * 100) > 49 ? HORIZONTAL : VERTICAL,
    intentos: 0,
    tamanyo: TAMANYOS.SUBMARINO,
    nombre: NOMBRES.SUBMARINO
  },
  {
    tipo: TIPO_CASILLLA.CRUCERO,
    orientacion: Math.floor(Math.random() * 100) > 49 ? HORIZONTAL : VERTICAL,
    intentos: 0,
    tamanyo: TAMANYOS.CRUCERO,
    nombre: NOMBRES.CRUCERO
  },
  {
    tipo: TIPO_CASILLLA.CRUCERO,
    orientacion: Math.floor(Math.random() * 100) > 49 ? HORIZONTAL : VERTICAL,
    intentos: 0,
    tamanyo: TAMANYOS.CRUCERO,
    nombre: NOMBRES.CRUCERO
  },  
  {
    tipo: TIPO_CASILLLA.LANCHA,
    orientacion: Math.floor(Math.random() * 100) > 49 ? HORIZONTAL : VERTICAL,
    intentos: 0,
    tamanyo: TAMANYOS.LANCHA,
    nombre: NOMBRES.LANCHA
  },
  {
    tipo: TIPO_CASILLLA.LANCHA,
    orientacion: Math.floor(Math.random() * 100) > 49 ? HORIZONTAL : VERTICAL,
    intentos: 0,
    tamanyo: TAMANYOS.LANCHA,
    nombre: NOMBRES.LANCHA
  }
]

let tablero = new Array(POSICIONES).fill(TIPO_CASILLLA.AGUA);

let barcosOrdenados = BARCOS.sort((a, b) => {
  return a.tamanyo < b.tamanyo ? 1 : -1;
});

barcosOrdenados.forEach(barco => {
  situaBarco(barco);
});

const elements = tablero.map(item => {
  const el = document.createElement('div');
  el.style.border = 'solid 1px #000';
  el.style.backgroundColor = (item === TIPO_CASILLLA.AGUA || item === TIPO_CASILLLA.MARGEN) ? 'cyan' : 'red';
  el.innerHTML = item !== TIPO_CASILLLA.AGUA && item !== TIPO_CASILLLA.MARGEN ? item : '';
  return el;
});

const container = document.getElementById('container');
elements.forEach(el => container.appendChild(el));

const resumen = document.getElementById('resumen');
BARCOS.forEach(barco => {
  const el = document.createElement('div');
  el.innerHTML = `Objeto de tipo ${barco.nombre} situado en ${barco.intentos} intentos`;
  resumen.appendChild(el);
});

function situaBarco(barco) {
  const libres = posicionesLibres();
  let posInfo = { pos: [], situado: false };
  do {
    const pos = libres[Math.floor(Math.random() * libres.length)];
    posInfo = barco.orientacion === HORIZONTAL ? compruebaHorizontal(barco, pos) : compruebaVertical(barco, pos);
    if(barco.intentos > 100) {
      posInfo.situado = true;
    } else if (posInfo.situado) {
      pintaBarcoEnTablero(posInfo, barco, pos)
    }
    barco.intentos++;
  } while (!posInfo.situado);
}

function posicionesLibres() {
  return tablero.map((value, index) => value === TIPO_CASILLLA.AGUA ? index : -1).filter(item => item > -1);
}

function compruebaHorizontal(barco, pos) {
  let posInfo = {
    pos: [],
    situado: false
  };
  const columna = pos % COLUMNAS;
  if ((barco.tamanyo + columna) < COLUMNAS) {
    const centrales = new Array(barco.tamanyo).fill(null)
      .map((_value, index) => [(pos + index), (pos + index) - COLUMNAS, (pos + index) + COLUMNAS]).flat();

    const inicio = columna > 0 ? [pos - 1, (pos - 1) - COLUMNAS, (pos - 1) + COLUMNAS] : []
    const final = columna < (COLUMNAS - 1) ? [pos + barco.tamanyo, (pos + barco.tamanyo) - COLUMNAS, (pos + barco.tamanyo) + COLUMNAS] : [];

    posInfo = getPostInfo(centrales, inicio, final);
  }
  return posInfo;
}

function compruebaVertical(barco, pos) {
  let posInfo = {
    pos: [],
    situado: false
  };
  const fila = Math.floor(pos / COLUMNAS);
  const columna = pos % COLUMNAS;
  if ((barco.tamanyo + fila) < COLUMNAS) {
    const centrales = new Array(barco.tamanyo).fill(null)
      .map((_value, index) => [
        (pos + (index * COLUMNAS)),
        columna > 0 ? (pos + (index * COLUMNAS)) - 1 : -1,
        columna < COLUMNAS - 1 ? (pos + (index * COLUMNAS)) + 1 : -1
      ]).flat();

    const inicio = [
      pos - COLUMNAS,
      columna > 0 ? (pos - COLUMNAS) - 1 : -1,
      columna < COLUMNAS - 1 ? (pos - COLUMNAS) + 1 : -1
    ];
    const final = [
      pos + (COLUMNAS * barco.tamanyo),
      columna > 0 ? (pos + (COLUMNAS * barco.tamanyo)) - 1 : -1,
      columna < COLUMNAS - 1 ? (pos + (COLUMNAS * barco.tamanyo)) + 1 : -1
    ];

    posInfo = getPostInfo(centrales, inicio, final);
  }
  return posInfo;
}

function getPostInfo(centrales, inicio, final) {
  const lista = [...centrales, ...inicio, ...final].filter(i => i > 0 && i < POSICIONES);

  return {
    pos: lista,
    situado: lista.map(value => tablero[value]).every(item => item === TIPO_CASILLLA.AGUA || item === TIPO_CASILLLA.MARGEN)
  }
}

function pintaBarcoEnTablero(posInfo, barco, pos) {
  posInfo.pos.forEach(item => tablero[item] = TIPO_CASILLLA.MARGEN);
  const limite = barco.orientacion === HORIZONTAL ? barco.tamanyo : barco.tamanyo * COLUMNAS;
  const incremento = barco.orientacion === HORIZONTAL ? 1 : COLUMNAS;
  for(let i = pos; i < pos + limite; i = i + incremento) {
    tablero[i] = barco.tipo;
  }
}
