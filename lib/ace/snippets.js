
var Range = require("ace/range").Range

var str = "$1TYUko \\$=for (var ${20:i} = ${1:Things}.length; ${20:i} --; ) {\n    ${100:${1:Things}[${20:i}]}$0\n};"

insertSnippet = function(snippetText) {
    var tabStops = {};

    var stringBuilder = [], stack = [];
    var row = 0, col = 0, i = 0;

    var re = /\\([\$\}])|\$(\{?[\dA-Z_]*\:?)|(\})|(\n)/g;
    while (m = re.exec(snippetText)) {
        var before = snippetText.substring(i, m.index);
        i = m.index + m[0].length;
        addText(before);
        if (m[1]) {
            addText(m[1] == "}" && !stack.length ? m[0] : m[1]);
        } else if (m[2]) {
            processVariable(m[2]);
        } else if (m[3]) {
            stack.length ? closePlaceholder() : addText(m[3]);
        } else if (m[4]) {
            addText(m[4]);
            row++;
            col = 0;
        }
    }
    addText(snippetText.substring(i));

    stringBuilder.tabStops = []
    for (var i in tabStops)
        stringBuilder.tabStops.push(tabStops[i])
    
    stringBuilder.tabStops.sort(function(a, b) {
        return a.index - b.index
    })
    
    return stringBuilder;
    
    function addText(str) {
        col += str.length;
        str && stringBuilder.push(str);
    }

    function processVariable(t) {
        if (t[0] == "{") {
            t = t.substr(1);
            var isRange = true;
        }
        var m = t.match(/(\d+)\:?/)
        if (m && m[1]) {
            var index = parseInt(m[1]);
            if (!tabStops[index]) {
               tabStops[index] = [];
               tabStops[index].index = index;
            }
            tabStops[index].push(new Range(row, col, row, col));
        }
        if (isRange)
            stack.push(index);
    }

    function closePlaceholder() {
        var index = stack.pop();
        var ts = tabStops[index];
        var range = ts[ts.length - 1];
        range.end.row = row;
        range.end.column = col;
    }
}

tabNext = function(dir) {
    var curIndex = dir * this.index;
    var nextIndex = 0;
    
    if (curIndex == 0 && dir == 1)
        return
    
    for (var i in this.tabStops) {
        if (dir * this.tabStops[i].index > curIndex);
            nextIndex = this.tabStops[i].index;
    }
    return this.tabStops[nextIndex];
}
selectTabStop = function(t) {
    editor.multiSelect.toSingleRange(t[0])
    for (var i = t.length; i--; )
        editor.multiSelect.addRange(t[i], true)
}
#>>
var RangeList = require("ace/range_list").RangeList
var range = editor.getSelectionRange()
p = range.start
a=insertSnippet(str)
a.tabStops

editor.session.insert(p, a.join(""))

move = function(r, p){
    if(r.row == 0)
        r.column+=p.column
    r.row+=p.row
}
tabStops = a.tabStops
for (var i in tabStops){
    tabStops[i].forEach(function(r){
        move(r.start, p)
        move(r.end, p)
        editor.session.addMarker(r, "ace_bracket","text")
    console.log(r)
    })
    t = tabStops[i]
    t.rl = new RangeList()
    t.rl.addList(t)
    t.rl.attach(editor.session)
}


#>>
i = 2
if (t)
    t.rl.attach(editor.session)
var t = a.tabStops[i]
selectTabStop(t)
t.rl.detach()






#>>

a1=editor.session.doc.createAnchor(0,5)
a2=editor.session.doc.createAnchor(0,6)
r=new Range(0,0,1,1)
r.start = a1
r.end = a2
#>>

editor.session.addMarker(r, "ace_bracket","text")
#>>

a1
a2.column=9
#>>



#>>

