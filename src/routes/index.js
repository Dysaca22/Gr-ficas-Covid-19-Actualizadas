const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
    res.status(200).render('inicial.html', {
        title: 'Reportes Covid-19'
    });
});

router.get('/consultaTotal', async function (req, res) {
    res.status(200).render('consultaTotal.html', {
        title: 'Consulta Total de Reportes Covid-19'
    });
});

router.get('/agregation/:fi/:ff', async function (req, res) {
    var fechaInicial = new Date(req.params['fi']);
    var fechaFinal = new Date(req.params['ff']);
    try {
        await reportes.creacionReportes(fechaInicial, fechaFinal);
        res.status(200).render('agregation.html', {
            title: 'Reportes de Covid-19',
            salida: 'Se ha agregado correctamente los registro'
        });
    } catch (error) {
        res.status(400).render('agregation.html', {
            title: 'Reportes de Covid-19',
            salida: 'Ha ocurrido un error en la agregación de los registro'
        });
    }
});

router.get('/consultaParcial', async function (req, res) {
    var est = req.query.estadistica;
    var reg = req.query.region;
    var {
        urlDB,
        key,
        pagina
    } = await estadistica(reg, est);
    
    res.status(200).render(pagina, {
        title: `Consulta ${est} en ${reg}`,
        'urlDB': urlDB,
        key: key,
        region: reg,
        estadistica: est
    });
});

function estadistica(reg, est) {
    urlDB = [];
    key = '';
    switch (est) {
        case 'Infectados':
            urlDB = ['SELECT fecha_inicio_sintomas, count(*) ' +
                getDepartOption(reg) + 
                'GROUP BY fecha_inicio_sintomas ' +
                'ORDER BY fecha_inicio_sintomas'];
            key = 'fecha_inicio_sintomas';
            pagina = 'consultaParcial.html';
            break;
        case 'Recuperados':
            urlDB = ['SELECT fecha_recuperado, count(*) ' +
                getDepartOption(reg) + 
                'AND recuperado = "Recuperado" ' +
                'GROUP BY fecha_recuperado ' +
                'ORDER BY fecha_recuperado'];
            key = 'fecha_recuperado';
            pagina = 'consultaParcial.html';
            break;
        case 'Muertos':
            urlDB = ['SELECT fecha_muerte, count(*) ' +
                getDepartOption(reg) +
                'AND recuperado = "Fallecido" ' +
                'GROUP BY fecha_muerte ' +
                'ORDER BY fecha_muerte'];
            key = 'fecha_muerte';
            pagina = 'consultaParcial.html';
            break;
        case 'Logatirmo Infectados':
            urlDB = ['SELECT fecha_reporte_web, count(*) ' +
                getDepartOption(reg) +
                'GROUP BY fecha_reporte_web ' +
                'ORDER BY fecha_reporte_web'];
            key = 'fecha_reporte_web';
            pagina = 'logInfectados.html';
            break;
        case 'Reproducción Temporal':
            urlDBRecu = 'SELECT fecha_reporte_web count(*) ' + 
                getDepartOption(reg) +
                'AND recuperado = "Recuperado" ' +
                'GROUP BY fecha_reporte_web ' +
                'ORDER BY fecha_reporte_web';
            urlDBMuer = 'SELECT fecha_reporte_web count(*) ' + 
                getDepartOption(reg) +
                'AND recuperado = "Fallecido" ' +
                'GROUP BY fecha_reporte_web ' +
                'ORDER BY fecha_reporte_web';
            urlDBInf = 'SELECT fecha_reporte_web count(*) ' + 
                getDepartOption(reg) +
                'GROUP BY fecha_reporte_web ' +
                'ORDER BY fecha_reporte_web';
            urlDB = [urlDBRecu, urlDBMuer, urlDBInf];
            key = 'fecha_reporte_web';
            pagina = 'reproduccionTemporal';
            break;
    }
    return {
        urlDB,
        key,
        pagina
    }
}

function getDepartOption(reg){
    if (reg === "COLOMBIA"){
        return "";
    }else{
        return `WHERE (departamento_nom = "${reg.toUpperCase()}" OR departamento_nom = "${reg.toLowerCase()}") `;
    }
}

module.exports = router;