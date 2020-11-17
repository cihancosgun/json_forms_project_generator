var projects = [];
var createFormProjectId = 0;
var createFormFormId = 0;
var bf;

var BrutusinForms = brutusin["json-forms"];
BrutusinForms.bootstrap.addFormatDecorator("inputstream", "file", "glyphicon-search", function (element) {
    alert("user callback on element " + element)
});
BrutusinForms.bootstrap.addFormatDecorator("color", "color");
BrutusinForms.bootstrap.addFormatDecorator("date", "date");

function createProject() {
    $('#createProjectForm')[0].reset();
    $('#createProjectModal').modal('show');
}

function saveProject() {
    const formData = new FormData($('#createProjectForm')[0]);
    let newProject = { Id: projects.length, projectName: formData.get('projectName') };
    projects.push(newProject);
    $('#createProjectModal').modal('hide');
    mainNavBar.append(getProjectLink(newProject));
}

function getProjectLink(project) {
    let projectLink = $("<li class=\"treeview\">" +
        "<a href=\"#\">" +
        "<i class=\"fa fa-circle\"><\/i> " +
        "<span>" + project.projectName + "<\/span>\r\n" +
        "<span class=\"pull-right-container\">\r\n" +
        "<i class=\"fa fa-angle-left pull-right\"><\/i>\r\n" +
        "<\/span>\r\n" +
        "<\/a>\r\n" +
        "<ul id=\"projectUl" + project.Id + "\" class=\"treeview-menu\">\r\n" +
        "<li><a href=\"#\" onclick=\"createForm(" + project.Id + ")\"><i class=\"fa fa-plus\"><\/i> Create Form<\/a><\/li>\r\n<\/ul>\r\n<\/li>");
    return projectLink[0];
}

function getFormLink(form) {
    let link = $("<li><a href=\"#\" onclick=\"showForm(" + form.projectId + "," + form.Id + ")\"><i class=\"fa fa-circle-o\"><\/i>" + form.formName + "<\/a><\/li>");
    return link[0];
}

function createForm(projectId) {
    createFormProjectId = projectId;
    $('#createFormForm')[0].reset();
    $('#createFormModal').modal('show');
}

function saveForm() {
    const formData = new FormData($('#createFormForm')[0]);
    if (projects[createFormProjectId].childs === undefined) {
        projects[createFormProjectId].childs = [];
    }
    let formId = projects[createFormProjectId].childs.length;
    let newForm = { projectId: createFormProjectId, Id: formId, formName: formData.get('formName') };
    projects[createFormProjectId].childs.push(newForm);
    $('#createFormModal').modal('hide');
    $("#projectUl" + createFormProjectId)[0].append(getFormLink(newForm));
    console.log(projects);
}

function showForm(projectId, formId) {
    let project = projects[projectId];
    let form = project.childs[formId];
    $('#formEditorCaption').html(form.formName);
    $('#formEditorTitle').html(form.formName);
    let data = form.data !== undefined ? form.data : null;
    bf = BrutusinForms.create(jsonSchema);
    var container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    bf.render(container, data);
    createFormProjectId = projectId;
    createFormFormId = formId;
}

function saveFormData() {
    let data = bf.getData();
    console.log(data);
    let project = projects[createFormProjectId];
    let form = project.childs[createFormFormId];
    form.data = data;
}

var jsonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "additionalProperties": false,
    "definitions": {
        "bson-item": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "view-item": {
            "type": "object",
            "properties": {
                "key": {
                    "type": "string"
                },
                "permit": {
                    "type": "string"
                },
                "order": {
                    "type": "number",
                    "enum": [10, 20, 30]
                }
            }
        },
        "sort-item": {
            "type": "object",
            "properties": {
                "key": {
                    "type": "string"
                },
                "value": {
                    "type": "number",
                    "enum": [1, -1]
                }
            }
        },
        "query-item": {
            "type": "object",
            "properties": {
                "key": {
                    "type": "string"
                },
                "value": {
                    "type": "string"
                },
                "type": {
                    "type": "string",
                    "enum": ["number", "string"]
                }
            }
        },
        "field": {
            "type": "object",
            "properties": {
                "key": {
                    "type": "string"
                },
                "field": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "shortName": {
                    "type": "string"
                },
                "order": {
                    "type": "number",
                    "minimum": 10,
                    "maximum": 1000
                },
                "reportOrder": {
                    "type": "number",
                    "minimum": 10,
                    "maximum": 1000
                },
                "rendered": {
                    "type": "boolean"
                },
                "reportRendered": {
                    "type": "boolean"
                },
                "readonly": {
                    "type": "boolean"
                },
                "quickFilter": {
                    "type": "boolean"
                },
                "roleCheck": {
                    "type": "boolean"
                },
                "money": {
                    "type": "boolean"
                },
                "observable": {
                    "type": "boolean"
                },
                "componentType": {
                    "type": "string",
                    "enum": ["inputText", "inputTextarea", "inputDate", "selectOneMenu", "selectBooleanCheckbox"]
                },
                "valueType": {
                    "type": "string",
                    "enum": ["java.lang.String", "java.lang.Integer", "java.lang.Boolean"]
                },
                "accesscontrol": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "converter": {
                    "type": "string",
                    "enum": ["SelectOneStringConverter", "SelectOneObjectIdConverter"]
                },
                "items": {
                    "type": "object",
                    "properties": {
                        "ref": {
                            "type": "object",
                            "properties": {
                                "db": {
                                    "type": "string"
                                },
                                "itemTable": {
                                    "type": "string"
                                },
                                "query": {
                                    "type": "object",
                                    "properties": {
                                        "func": {
                                            "type": "string"
                                        },
                                        "list": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/query-item"
                                            }
                                        }
                                    }
                                },
                                "sort": {
                                    "type": "object",
                                    "properties": {
                                        "func": {
                                            "type": "string"
                                        },
                                        "list": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/sort-item"
                                            }
                                        }
                                    }
                                },
                                "v": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/view-item"
                                    }
                                }
                            }
                        },
                        "func": {
                            "type": "string"
                        },
                        "list": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/bson-item"
                            }
                        }
                    }
                }
            }
        }
    },
    "properties": {
        "schemaVersion": {
            "type": "string"
        },
        "key": {
            "type": "string"
        },
        "db": {
            "type": "string"
        },
        "collection": {
            "type": "string"
        },
        "versionCollection": {
            "type": "string"
        },
        "userConstantNote": {
            "type": "string"
        },
        "userNote": {
            "type": "string"
        },
        "form": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "forms": {
            "type": "string"
        },
        "defaultSortField": {
            "type": "string"
        },
        "loginFkField": {
            "type": "string"
        },
        "menuOrder": {
            "type": "number"
        },
        "dimension": {
            "type": "number",
            "enum": [1, 2, 3]
        },
        "type": {
            "type": "string",
            "enum": ["node", "website"]
        },
        "filter": {
            "type": "object",
            "properties": {
                "forms": {
                    "type": "string"
                }
            }
        },
        "myNamedQueries": {
            "type": "object",
            "properties": {
                "overAllCheck": {
                    "type": "string"
                }
            }
        },
        "accesscontrol": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "upperNodes": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "actions": {
            "type": "object",
            "properties": {
                "create": {
                    "type": "object",
                    "properties": {
                        "permit": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "func": {
                            "type": "string"
                        },
                        "shoot": {
                            "type": "boolean"
                        }
                    }
                },
                "delete": {
                    "type": "object",
                    "properties": {
                        "permit": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "func": {
                            "type": "string"
                        },
                        "shoot": {
                            "type": "boolean"
                        }
                    }
                },
                "download": {
                    "type": "object",
                    "properties": {
                        "permit": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "func": {
                            "type": "string"
                        },
                        "shoot": {
                            "type": "boolean"
                        }
                    }
                },
                "read": {
                    "type": "object",
                    "properties": {
                        "permit": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "func": {
                            "type": "string"
                        },
                        "shoot": {
                            "type": "boolean"
                        }
                    }
                },
                "save": {
                    "type": "object",
                    "properties": {
                        "permit": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "func": {
                            "type": "string"
                        },
                        "shoot": {
                            "type": "boolean"
                        }
                    }
                },
                "upload": {
                    "type": "object",
                    "properties": {
                        "permit": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "func": {
                            "type": "string"
                        },
                        "shoot": {
                            "type": "boolean"
                        }
                    }
                }
            }
        },
        "fields": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/field"
            }
        }
    }
};