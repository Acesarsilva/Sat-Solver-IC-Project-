var fs = require('fs')
var formula = readFormula('simple0.cnf')
var resultado = doSolve(formula.clauses, formula.variables)
console.log(resultado)
console.log(resposta)
var resposta
function doSolve(clauses, variables) {
    if (clauses.length == 0) {
        resposta = variables
        return true
    }
    var unica = search1(clauses, variables)
    var continuar = stop(clauses, unica.variable)
    if (!continuar) {
        if (unica.variable != 0) {
            return doSolve(nextClausses(clauses, unica.variable, unica.variables), unica.variables)
        } else {
            var valorado = Math.abs(clauses[0][0])
            if (!stop(clauses, valorado)) {
                variables[valorado - 1] = 1
                if (doSolve(nextClausses(clauses, valorado, variables), variables).boolean) {
                    return true
                }
                variables[valorado - 1] = 0
                if (doSolve(nextClausses(clauses, valorado, variables), variables).boolean) {
                    return true
                }
            }
        }
    }else{
        return false
    }
}
function search1(clauses, variables) {
    for (var length = 0; length < clauses.length; length++) {
        if (clauses[length].length == 1) {
            if (clauses[length][0] > 0) {
                variables[clauses[length][0] - 1] = 1
            } else {
                variables[Math.abs(clauses[length][0]) - 1] = 0
            }
            var unica = { variable: clauses[length][0], variables: variables }
            return unica
        }
    }
    return { variable: 0, variables: null }
}
function nextClausses(clauses, variable, variables) {
    for (var length = 0; length < clauses.length; length++) {
        if ((clauses[length].indexOf(variable) != -1) && (((variable > 0) && (variables[variable - 1] == 1))
            || (variable < 0) && (variables[Math.abs(variable) - 1] == 0))) {
            clauses.splice(length, 1)
            length--
        } else {
            for (var length2 = 0; length2 < clauses[length].length; length2++) {
                if (clauses[length][length2] == variable * -1) {
                    clauses[length].splice(length2, 1)
                    length2--
                }
            }
        }
    }
    return clauses
}
function stop(clauses, variable) {
    for (var length = 0; length < clauses.length; length++) {
        if ((clauses[length].length == 1) && (clauses[length][0] == variable * -1)) {
            return true
        }
    }
    return false
}
function readFormula(fileName) {
    let text = fs.readFileSync(fileName, 'utf8')
    let clauses = readClauses(text)
    let formula = readVariables(clauses)
    clauses = formula.clauses
    let variables = formula.variables
    let specOk = checkProblemSpecification(text, clauses, variables)
    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }
    return result
}
function readClauses(text) {
    var clauses = []
    text = text.split('\n')
    for (var length = 0; length < text.length; length++) {
        if (text[length][0] != "c" && text[length][0] != "p" && text[length][0] != null) {
            if (text[length][text[length].length - 1] == 0) {
                clauses.push(text[length].split(" "))
                clauses[clauses.length - 1].pop()
            } else {
                clauses[clauses.length - 1] += (text[length].split(" "))
            }
        }
    }
    return clauses
}
function readVariables(clauses) {
    let auxiliar = { 'variables': [], 'clauses': [] }
    var variables = []
    for (var length = 0; length < clauses.length; length++) {
        for (var length2 = 0; length2 < clauses[length].length; length2++) {
            clauses[length][length2] = parseInt(clauses[length][length2])
            var variable = clauses[length][length2]
            if (variables.indexOf(Math.abs(variable)) == -1) {
                variables.push(Math.abs(variable))
            }
        }
    }
    for (var aux = 0; aux < variables.length; aux++) {
        variables[aux] = 2
    }
    auxiliar.clauses = clauses
    auxiliar.variables = variables
    return auxiliar
}
function checkProblemSpecification(text, clauses, variables) {
    var nVariables = 0
    var nClauses = 0
    text = text.split('\n')
    for (var length = 0; (length < text.length); length++) {
        if (text[length][0] == "p") {
            var aux = text[length].split(' ')
            nClauses = aux[3]
            nVariables = aux[2]
            if ((nClauses != clauses.length) || (nVariables != variables.length)) {
                return false
            } else {
                return true
            }
        }
    }
}