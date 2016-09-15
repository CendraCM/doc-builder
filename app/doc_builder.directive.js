(function(){
  'use strict';

  var treeTemplate =
    '<md-list ng-switch="schema.type" layout="column" flex ng-class="{\'md-whiteframe-1dp\': !isChild}">'+
      '<div ng-switch-when="array" ng-repeat="item in ngModel track by $index">'+
        '<md-menu-item layout="column" ng-if="getType(schema.items)==\'array\' && schema.items[$index]">'+
          '<md-button ng-class="{\'md-primary\': selected.parent == ngModel && selected.key == $index}" ng-click="select($index)">{{$index+1}}: '+
            '<span ng-if="[\'array\', \'object\'].indexOf(schema.items[$index].type) === -1">{{item}}</span>'+
          '</md-button>'+
          '<doc-builder-tree ng-if="[\'array\', \'object\'].indexOf(schema.items[$index].type) !== -1" schema="schema.items[$index]" ng-model="item" selected="selected"></doc-builder-tree>'+
        '</md-menu-item>'+
        '<md-menu-item layout="column" ng-if="getType(schema.items)==\'object\'">'+
          '<md-button ng-class="{\'md-primary\': selected.parent == ngModel && selected.key == $index}" ng-click="select($index)">{{$index+1}}: '+
            '<span ng-if="[\'array\', \'object\'].indexOf(schema.items.type) === -1">{{item}}</span>'+
          '</md-button>'+
          '<doc-builder-tree ng-if="[\'array\', \'object\'].indexOf(schema.items.type) !== -1" schema="schema.items" ng-model="item" selected="selected"></doc-builder-tree>'+
        '</md-menu-item>'+
        '<md-menu-item layout="column" ng-if="!schema.items || (getType(schema.items)!=\'object\' && !schema.items[$index])">'+
          '<md-button ng-class="{\'md-primary\': selected.parent == ngModel && selected.key == $index}" ng-click="select($index)">{{$index+1}}: '+
            '<span ng-if="[\'array\', \'object\'].indexOf(getType(item)) === -1">{{item}}</span>'+
          '</md-button>'+
          '<doc-builder-tree ng-if="[\'array\', \'object\'].indexOf(getType(item)) !== -1" ng-model="item" selected="selected"></doc-builder-tree>'+
        '</md-menu-item>'+
      '</div>'+
      '<div ng-switch-when="object" ng-repeat="(key, val) in ngModel|objKey:\'!<\':\'obj\'" ng-if="key != \'objName\'">'+
        '<md-menu-item layout="column" ng-if="[\'array\', \'object\'].indexOf((schema.properties[key] && schema.properties[key].type)||getType(val)) !== -1">'+
          '<md-button ng-class="{\'md-primary\': selected.parent == ngModel && selected.key == key, \'md-warn\': dirty && (schema.required && schema.required.indexOf(key)!==-1) && isEmpty(val)}" ng-click="select(key)">{{key}}:</md-button> '+
          '<doc-builder-tree schema="schema.properties[key]" ng-model="val" selected="selected"></doc-builder-tree>'+
        '</md-menu-item>'+
        '<md-menu-item ng-if="[\'array\', \'object\'].indexOf((schema.properties[key] && schema.properties[key].type)||getType(val)) === -1">'+
          '<md-button ng-class="{\'md-primary\': selected.parent == ngModel && selected.key == key, \'md-warn\': dirty && (schema.required && schema.required.indexOf(key)!==-1) && isEmpty(val)}"   ng-click="select(key)">{{key}}: {{val}}</md-button>'+
        '</md-menu-item>'+
      '</div>'+
    '</md-list>';

  var tabTemplate =
    '<doc-builder-tree ng-if="!hideTab" schema="schema" ng-model="ngModel" selected="selected"></doc-builder-tree>'+
    '<form ng-submit="doAction()" ng-if="edit && !hideTab" ng-switch="selectedSchema.type">'+
      '<div layout="row" ng-switch-when="array" md-whiteframe="2" layout-padding>'+
        '<md-input-container class="schema-type" ng-disabled="selected.root||interface">'+
          '<label>Tipo Elemento</label>'+
          '<md-select ng-model="selectedSchema.type" ng-change="typeChange()">'+
            '<md-option ng-repeat="(key, val) in types" ng-value="key">{{val}}</md-option>'+
          '</md-select>'+
        '</md-input-container>'+
        '<md-button type="submit" ng-disabled="">'+
          'Agregar Item'+
        '</md-button>'+
        '<md-button ng-click="clear()">'+
          'Vaciar Conjunto'+
        '</md-button>'+
        '<span flex></span>'+
        '<md-button ng-if="!selected.root" class="md-icon-button" ng-click="delete()">'+
          '<md-icon md-font-set="material-icons">delete</md-icon>'+
        '</md-button>'+
      '</div>'+
      '<div layout="row" ng-switch-when="object" md-whiteframe="2" layout-padding>'+
        '<md-input-container class="schema-type" ng-if="!selected.root">'+
          '<label>Tipo Elemento</label>'+
          '<md-select ng-model="selectedSchema.type"  ng-change="typeChange()">'+
            '<md-option ng-repeat="(key, val) in types" ng-value="key">{{val}}</md-option>'+
          '</md-select>'+
        '</md-input-container>'+
        '<md-input-container>'+
          '<label>Etiqueta</label>'+
          '<input ng-model="selected.new" required/>'+
        '</md-input-container>'+
        '<md-button type="submit">'+
          'Agregar'+
        '</md-button>'+
        '<md-button ng-click="clear()">'+
          'Vaciar Formulario'+
        '</md-button>'+
        '<span flex></span>'+
        '<md-button  ng-if="!selected.root" class="md-icon-button" ng-click="delete()">'+
          '<md-icon md-font-set="material-icons">delete</md-icon>'+
        '</md-button>'+
      '</div>'+
      '<div layout="row" ng-switch-default md-whiteframe="2" layout-padding>'+
        '<md-input-container class="schema-type" ng-if="!selected.root">'+
          '<label>Tipo Elemento</label>'+
          '<md-select ng-model="selectedSchema.type"  ng-change="typeChange()">'+
            '<md-option ng-repeat="(key, val) in types" ng-value="key">{{val}}</md-option>'+
          '</md-select>'+
        '</md-input-container>'+
        '<md-input-container ng-if="selectedSchema.type!=\'boolean\'">'+
          '<label>Valor</label>'+
          '<input ng-model="selected.parent[selected.key]" type="{{selectedSchema.format==\'date-time\'?\'datetime\':selectedSchema.type}}"/>'+
        '</md-input-container>'+
        '<md-checkbox ng-model="selected.parent[selected.key]" layout="row" layout-align="center center" ng-if="selectedSchema.type==\'boolean\'">'+
          '<div layout-fill>{{selected.key}}</div>'+
        '</md-checkbox>'+
        '<span flex></span>'+
        '<md-button ng-if="!selected.root && (!selectedSchema.required || selectedSchema.required.indexOf(selected.key)===-1)" class="md-icon-button" ng-click="delete()">'+
          '<md-icon md-font-set="material-icons">delete</md-icon>'+
        '</md-button>'+
      '</div>'+
    '</form>';

  var template=
    '<form name="mainForm" ng-if="!isChild" md-whiteframe="2" layout-padding>'+
      '<div layout="row">'+
        '<div layout="column">'+
          '<md-input-container>'+
            '<label>Titulo Documento</label>'+
            '<input ng-model="copy.objName" name="documentName" required/>'+
          '</md-input-container>'+
          '<md-input-container ng-show="editMetadata">'+
            '<label>Descripci&oacute;n</label>'+
            '<input ng-model="copy.objDescription" name="documentDescription"/>'+
          '</md-input-container>'+
        '</div>'+
        '<md-button class="md-icon-button" ng-click="editMetadata=!editMetadata">'+
          '<md-icon md-font-set="material-icons">edit</md-icon>'+
        '</md-button>'+
        '<span flex></span>'+
        '{{copy}}'+
        '<md-button class="md-icon-button" ng-click="doSave(mainForm)">'+
          '<md-icon md-font-set="material-icons">save</md-icon>'+
        '</md-button>'+
        '<md-button class="md-icon-button" ng-click="doCancel()">'+
          '<md-icon md-font-set="material-icons">cancel</md-icon>'+
        '</md-button>'+
      '</div>'+
    '</form>'+
    '<div layout="row">'+
      '<md-button ng-if="copy.objInterface && copy.objInterface.length" ng-repeat="interface in copy.objInterface" ng-class="{\'md-primary\': selectedInterface == interface}" ng-click="selectInterface(interface)">{{getName(interface).plain}}</md-button>'+
      '<md-button ng-click="selectInterface()" ng-class="{\'md-primary\': !selectedInterface}">'+
        'base'+
      '</md-button>'+
      '<md-button class="md-icon-button" ng-if="interfaces.length" ng-click="addInterface($event)">'+
        '<md-icon md-font-set="material-icons">add</md-icon>'+
      '</md-button>'+
    '</div>'+
    '<doc-builder-tab ng-model="copy[getName(interface).key]" ng-if="selectedInterface==interface" edit="edit" ng-repeat="interface in copy.objInterface" interface="map[interface]"></doc-builder-tab>'+
    '<doc-builder-tab ng-model="copy" ng-if="!selectedInterface" edit="edit" interfaceList="interfaces"></doc-builder-tab>';

  var dialogTemplate =
    '<md-dialog>'+
      '<md-dialog-content>'+
        '<div layout="row" layout-wrap>'+
          '<div class="interface" layout="column" layout-align="center center" flex="30" ng-repeat="interface in interfaces" ng-click="add(interface)">'+
            '<md-icon md-font-set="material-icons">library_books</md-icon>'+
            '{{interface.objName}}'+
          '</div>'+
        '</div>'+
      '</md-dialog-content>'+
      '<md-dialog-actions>'+
        '<md-button ng-click="close()" class="md-primary">'+
          '<md-icon md-font-set="material-icons">close</md-icon>'+
          '<span>cerrar</span>'+
        '</md-button>'+
      '</md-dialog-actions>'+
    '</md-dialog>';
  var isEmpty = function(element) {
    var type = getType(element);
    if(type=='array') {
      return !element.length;
    }
    if(type=='object') {
      for(var i in element) {
        if(i.substr(0,3)=='obj') continue;
        return false;
      }
      return true;
    }
    return angular.isUndefined(element)||element===null;
  };

  var buildSchema = function(element) {
    if(angular.isUndefined(element)||element == null) return;
    var schema = {};
    element.objName && (schema.title=element.objName);
    schema.type=getType(element);
    switch(schema.type) {
      case 'array':
        schema.items = [];
        angular.forEach(element, function(value, key) {
          schema.items[key] = buildSchema(value);
        });
        break;
      case 'date':
        schema.type = 'string';
        schema.format = 'date-time';
        break;
      case 'object':
        schema.properties = {};
        angular.forEach(element, function(value, key) {
          schema.properties[key] = buildSchema(value);
        });
        break;
    }
    return schema;
  };

  function buildDocument(schema) {
    var document = null;
    switch(schema.type) {
      case 'array':
        document = [];
        break;
      case 'object':
        document = {};
        angular.forEach(schema.properties, function(value, key) {
          document[key] = buildDocument(value);
        });
        break;
    }
    return document;
  }

  function getType(element) {
    if(angular.isArray(element)) {
      return 'array';
    }
    if(angular.isDate(element)) {
      return 'date';
    }
    if(angular.isObject(element)) {
      return 'object';
    }
    return element===null?'null':typeof element;
  }

  angular.module('cendra.builder', [])
  .filter('objKey', function() {
    var filterFn = function(object, action, filterString) {
      var deep = false, not = false, result = {}, origAction = action;
      if(action.substr(0,1).toLowerCase() == 'd') {
        deep = true;
        action = action.substr(1);
      }
      if(action.substr(0,1) == '!') {
        not = true;
        action = action.substr(1);
      }
      angular.forEach(object, function(value, key) {
        if(key=='_id') return;
        var add = false;
        if(action == '=' && ((!not && key == filterString)||(not && key != filterString))) {
          add = true;
        }
        if(action == '<' && ((!not && key.substr(0, filterString.length) == filterString)||(not && key.substr(0, filterString.length) != filterString))) {
          add = true;
        }
        if(action == '>' && ((!not && key.substr(-filterString.length) == filterString)||(not && key.substr(-filterString.length) != filterString))) {
          add = true;
        }
        if(add) {
          if(deep) {
            value = filterFn(value, origAction, filterString);
          }
          result[key] = value;
        }
      });
      return result;
    };
    return filterFn;
  })
  .directive('docBuilder', function() {
    return {
      restrict: 'E',
      template: template,
      scope: {
        ngModel: '=',
        edit: '<?',
        done: '&',
        interfaces: '=?'
      },
      controller: function($scope, $mdToast, $mdDialog) {
        if(!$scope.interfaces) $scope.interfaces=[];
        $scope.$watch('ngModel', function(value) {
          if(!value) {
            $scope.copy = {objName: ''};
          } else {
            $scope.copy = angular.merge({}, value);
          }
          if(!$scope.selectedModel) {
            $scope.selectedModel = $scope.copy;
          }
        });

        $scope.$watch('interfaces', function(value) {
          value = value||[];
          $scope.map = {};
          value.forEach(function(iface) {
            $scope.map[iface._id] = iface;
          });
        });

        var failConstraints = function(model, schema) {
          if(schema) {
            var fails = false;
            switch(schema.type) {
              case "object":
                if(schema.required) {
                  schema.required.forEach(function(property) {
                    if(!fails && isEmpty(model[property])) {
                      fails = "Faltan completar elementos obligatorios";
                      return false;
                    }
                  });
                } else {
                  for(var i in schema.properties) {
                    if(schema.properties[i].required && isEmpty(model[i])) {
                      fails = "Faltan completar elementos obligatorios";
                      break;
                    }
                  }
                }
                if(fails) return fails;
                for(var j in model) {
                  if((fails = failConstraints(model[j], schema[j]))) {
                    break;
                  }
                }
                return fails;
              case "array":
                if(getType(schema.items) == 'object') {
                  model.forEach(function(item) {
                    if((fails = failConstraints(item, schema.items))) {
                      return false;
                    }
                  });
                } else {
                  schema.items.forEach(function(schema, index) {
                    if((fails = failConstraints(model[index], schema))) {
                      return false;
                    }
                  });
                }
                return fails;
            }
          }
          return false;
        };

        $scope.doSave = function(mainForm) {
          mainForm.documentName.$setDirty();
          mainForm.documentName.$setTouched();
          if(isEmpty($scope.copy.objName)) {
            return $mdToast.showSimple('Debe Proporcionar un Nombre para el Documento.');
          }
          if(isEmpty($scope.copy)) {
            return $mdToast.showSimple('El documento no puede estar vacío.');
          }
          var error;
          if((error = failConstraints($scope.copy, $scope.schema))) {
            $scope.dirty = true;
            return $mdToast.showSimple(error);
          }
          for(var i in $scope.ngModel) {
            delete $scope.ngModel[i];
          }
          angular.copy($scope.copy, $scope.ngModel);
          $scope.done({canceled: false});
        };

        $scope.doCancel = function() {
          $scope.done({canceled: true});
        };

        $scope.addInterface = function($event) {
          $mdDialog.show({
            template: dialogTemplate,
            targetEvent: $event,
            locals: {
              interfaces: $scope.interfaces
            },
            clickOutsideToClose: true,
            controller: function($scope, $mdDialog, interfaces) {
              $scope.interfaces = interfaces;
              $scope.add = function(iface) {
                $mdDialog.hide(iface);
              };
            }
          })
          .then(function(iface) {
            if(!$scope.copy.objInterface) $scope.copy.objInterface=[];
            $scope.copy.objInterface.push(iface._id);
            $scope.selectInterface(iface._id);
          });
        };

        $scope.selectInterface = function(iface) {
          $scope.selectedInterface = iface;
          if(!iface) return;
          var key = $scope.getName(iface).key;
          if(!$scope.copy[key]) $scope.copy[key] = {};
        };

        $scope.getName = function(id) {
          var iface = $scope.map[id];
          if(!iface) return '';
          var ifaceName = iface.objName;
          var match;
          if((match = ifaceName.match(/^(.+)Interface$/))) {
            ifaceName = match[1];
          }
          var parts = ifaceName.match(/[A-Za-z][a-z]*/g);
          return {
            plain: parts.join(' ').toLowerCase(),
            key: parts.join('-').toLowerCase()
          };
        };

      }
    };
  })
  .directive('docBuilderTab', function($compile) {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        interface: '=',
        interfaceList: '=',
        edit: '<?'
      },
      template: tabTemplate,
      compile: function() {
        return {
          pre: function(scope, element) {
            scope.edit = angular.isUndefined(scope.edit)||scope.edit;
            if(scope.interface && scope.interface.objName) {
              var tagName = scope.interface.objName.match(/([A-Za-z][a-z0-9]*)/g).join('-').toLowerCase();
              var directive = $compile('<'+tagName+' ng-model="ngModel" interface="interface" edit="edit"></'+tagName+'>')(scope);
              element.wrap(directive);
            }
          }
        };
      },
      controller: function($scope) {
        if(!$scope.ngModel) $scope.ngModel = {};
        $scope.$watch('ngModel', function(value) {
          if($scope.interface) {
            $scope.schema = angular.merge({}, $scope.interface);
            if(isEmpty(value)) $scope.ngModel = buildDocument($scope.schema);
          } else if(!$scope.interface || ((!$scope.interface.properties||isEmpty($scope.interface.properties)) && (!$scope.interface.items||isEmpty($scope.interface.items)))) {
            $scope.schema = buildSchema(value);
          }
          if(!$scope.schema) $scope.schema = {type: 'object'};
          if(!$scope.selected) $scope.$emit('docBuilder:select', null);
        });

        $scope.$on('docBuilder:select', function($event, value) {
          $event.stopPropagation();
          if(!value) {
            value = {root: $scope.ngModel};
          }
          if(value.root) {
            $scope.selectedSchema = $scope.schema;
            $scope.memo = angular.merge({}, {selectedSchema: $scope.selectedSchema, value: $scope.ngModel});
          } else {
            var schema;
            switch(value.schema.type) {
              case "array":
                var type = getType(value.schema.items);
                schema = type=='array'?value.schema.items[value.key]:value.schema.items;
                break;
              case "object":
                schema = value.schema.properties[value.key];
            }
            $scope.selectedSchema = schema;
            $scope.memo = angular.merge({}, {selectedSchema: $scope.selectedSchema, value: value.parent[value.key]});
          }
          $scope.selected = value;
        });

        $scope.types = {
          'array': 'Conjunto',
          'date': 'Fecha/Hora',
          'object': 'Formulario',
          'number': 'Número',
          'string': 'Texto',
          'boolean': 'Verdadero/Falso'
        };

        $scope.doAction = function() {
          var element = $scope.selected.root||$scope.selected.parent[$scope.selected.key];
          var schema = $scope.selectedSchema;
          switch(schema.type) {
            case 'array':
              if(getType(schema.items)!='object') {
                var index = element.push(null) - 1;
                !schema.items && (schema.items=[]);
                schema.items[index]={type: 'string'};
              } else {
                var document = buildDocument(schema.items);
                element.push(document);
              }
              break;
            case 'object':
              element[$scope.selected.new] = null;
              !schema.properties && (schema.properties={});
              schema.properties[$scope.selected.new]={type: 'string'};
              delete $scope.selected.new;
              break;
            default:
              if(getType($scope.selected.parent)=='array' && angular.isDefined($scope.selected.parent[$scope.selected.key+1])) {
                $scope.selected.key+=1;
                //$scope.$emit('docBuilder:rootSelect', $scope.selected);
              }
              if(getType($scope.selected.parent)=='object') {
                var next = false;
                angular.forEach($scope.selected.parent, function(value, key) {
                  if(next=='done') return;
                  if(next) {
                    $scope.selected.key=key;
                    next='done';
                  } else if(key == $scope.selected.key) {
                    next=true;
                  }
                });
              }
          }
        };

        $scope.typeChange = function(){
          var schema = $scope.selectedSchema;
          var pschema = $scope.memo.selectedSchema;
          if(schema.type == pschema.type && !angular.isUndefined($scope.memo.value)) {
            return $scope.selected.parent[$scope.selected.key] = $scope.memo.value;
          }
          switch(schema.type) {
            case "object":
              $scope.selected.parent[$scope.selected.key] = {};
              break;
            case "array":
              $scope.selected.parent[$scope.selected.key] = [];
              break;
            default:
              $scope.selected.parent[$scope.selected.key] = null;
          }

        }

        $scope.clear = function() {
          var element = $scope.selected.root||$scope.selected.parent[$scope.selected.key];
          var type = getType(element);
          if(type=="array") {
            element.splice(0,element.length);
          } else {
            angular.forEach(element, function(value, key) {
              if(key.substr(0,3)!='obj') delete element[key];
            });
          }
        };

        $scope.delete = function() {
          if(getType($scope.selected.parent)=='array') {
            $scope.selected.parent.splice($scope.selected.key,1);
          } else {
            delete $scope.selected.parent[$scope.selected.key];
          }
          $scope.selected = {parent: null, key: null, schema: null};
        };
        /*$scope.getSelectedSchema = function(phantom) {
          var obj = phantom?$scope.phantom:$scope.selected;
          if(obj.root) {
            return $scope.schema;
          }
          var schema;
          switch(obj.schema.type) {
            case "array":
              var type = getType(obj.schema.items);
              schema = type=='array'?obj.schema.items[$scope.selected.key]:obj.schema.items;
              break;
            case "object":
              schema = obj.schema.properties[$scope.selected.key];
          }
          return schema;
        };*/
      }
    };
  })
  .directive('docBuilderTree', function() {
    return {
      restrict: 'E',
      template: treeTemplate,
      scope: {
        schema:'=',
        ngModel: '=',
        selected: '='
      },
      controller: function($scope) {
        $scope.getType = getType;
        $scope.isEmpty = isEmpty;

        $scope.select = function(key) {
          if(!$scope.schema) {
            $scope.schema = {type: getType($scope.ngModel[key])};
          }
          var element = {parent: $scope.ngModel, key: key, schema: $scope.schema};
          if($scope.selected.parent == element.parent && $scope.selected.key == element.key) {
            element = null;//{parent: null, key: null, schema: null};
          }
          $scope.$emit('docBuilder:select', element);
        };
      }
    };
  });
})();
