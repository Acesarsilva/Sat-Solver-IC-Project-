var fs = require('fs');
exports.solve = function (fileName) {
    let formula = readFormula(fileName)
    return doSolve(formula.clauses, formula.variables)
}
function doSolve(clauses, variables) {
    var limite = Math.pow(2, variables.length)
    var cont = 0
    let result = { 'boolean': false, 'variables': null }
    for (var length = 0; (length < clauses.length) && (cont != limite); length++) {
        var clauseTrue = false
        for (var length2 = 0; (!clauseTrue) && (length2 < clauses[length].length); length2++) {
            if (((clauses[length][length2] > 0) && (variables[clauses[length][length2] - 1] == 1)) || ((clauses[length][length2] < 0) &&
                (variables[Math.abs(clauses[length][length2]) - 1] == 0))) {
                clauseTrue = true
            }
        }
        if (!clauseTrue) {
            length = -1
            cont++
            variables = nextAssignement(variables)
        }
        if ((length == clauses.length - 1) && (clauseTrue)) {
            result.boolean = true
            result.variables = variables
        }
    }
    return result
}
function nextAssignement(variables) {
    for (var length = variables.length - 1; length >= 0; length--) {
        variables[length] += 1
        if (variables[length] == 1) {
            return variables
        } else {
            variables[length] = 0
        }
    }
    return variables
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
        variables[aux] = 0
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