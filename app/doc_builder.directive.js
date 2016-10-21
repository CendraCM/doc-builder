(function(){
  'use strict';

  var aclTreeTemplate =
    '<div layout="column" ng-repeat="item in _acl">'+
      '<div layout="row">'+
        '<div ng-repeat="space in $parent.spaces track by $index" class="space"></div>'+
        '<span class="md-body-2 offset-right">{{item.key}}</span>'+
        '<md-checkbox ng-model="item.read" ng-change="aclChange(item)">Leer</md-checkbox>'+
        '<md-checkbox ng-disabled="!item.read || !writable" ng-model="item.write" ng-change="aclChange(item)">Escribir</md-checkbox>'+
      '</div>'+
      '<doc-builder-acl-tree ng-if="item.read && item.properties" properties="item.properties" acl="acl" level="level" parent="item.path"></doc-builder-acl-tree>'+
    '</div>';

  var interfaceDialogTemplate =
    //'<md-dialog>'+
      '<form>'+
        '<md-toolbar>'+
          '<div class="md-toolbar-tools">'+
          '<h2 class="md-title">Agregar Tipo Documental</h2>'+
          '</div>'+
        '</md-toolbar>'+
        //'<md-dialog-content layout="column" layout-padding>'+
          '<div layout="row" layout="column" layout-padding layout-align="center center">'+
            '<md-input-container>'+
              '<label>Buscar</label>'+
              '<md-icon md-font-set="material-icons">search</md-icon>'+
              '<input ng-model="ifaceSearch" md-autofocus/>'+
            '</md-input-container>'+
          '</div>'+
          '<div layout="row" layout-wrap>'+
            '<div class="interface" layout="column" layout-align="center center" flex ng-repeat="interface in implementable|filter:ifaceSearch" ng-click="addInterface(interface)">'+
              '<md-icon md-font-set="material-icons">{{interface.objIcon||\'library_books\'}}</md-icon>'+
              '<div>{{interface.objName}}</div>'+
            '</div>'+
          '</div>'+
        /*'</md-dialog-content>'+
        '<md-dialog-actions>'+
          '<md-button ng-click="close()" class="md-primary">'+
            '<md-icon md-font-set="material-icons">close</md-icon>'+
            '<span>cerrar</span>'+
          '</md-button>'+
        '</md-dialog-actions>'+*/
      '</form>'/*+
    '</md-dialog>'*/;

  var documentDialogTemplate =
    //'<md-dialog>'+
      '<form>'+
        '<md-toolbar>'+
          '<div class="md-toolbar-tools">'+
            '<h2 class="md-title">Elegir Documento</h2>'+
            '<span flex></span>'+
            '<md-button class="md-icon-button" ng-click="$parent.documentFlag=false">'+
              '<md-icon md-font-set="material-icons">close</md-icon>'+
            '</md-button>'+
          '</div>'+
        '</md-toolbar>'+
        //'<md-dialog-content layout="column" layout-padding>'+
          '<div layout="row" layout-align="center center">'+
            '<md-input-container>'+
              '<label>Buscar</label>'+
              '<md-icon md-font-set="material-icons">search</md-icon>'+
              '<input ng-model="$parent.docSearchText" md-autofocus ng-change="docSearch()"/>'+
            '</md-input-container>'+
          '</div>'+
          '<div layout="row" layout-wrap>'+
            '<div class="interface" layout="column" layout-align="center center" flex ng-repeat="document in searchDocumentList" ng-click="addDocument(document)">'+
              '<md-icon md-font-set="material-icons">{{document.objIcon||\'library_books\'}}</md-icon>'+
              '<div>{{document.objName}}</div>'+
            '</div>'+
          '</div>'+
        /*'</md-dialog-content>'+
        '<md-dialog-actions>'+
          '<md-button ng-click="new()">'+
            '<md-icon md-font-set="material-icons">add</md-icon>'+
            '<span>nuevo</span>'+
          '</md-button>'+
          '<md-button ng-click="close()">'+
            '<md-icon md-font-set="material-icons">close</md-icon>'+
            '<span>cerrar</span>'+
          '</md-button>'+
        '</md-dialog-actions>'+*/
      '</form>';/*+
    '</md-dialog>';*/

  var metadataDialogTemplate =
    //'<md-dialog>'+
      '<form class="dialog" ng-submit="saveMetadata()" md-whiteframe="2">'+
        '<md-toolbar>'+
          '<div class="md-toolbar-tools">'+
            '<h2 class="md-title">Editar Metadatos del Documento</h2>'+
            '<span flex></span>'+
            '<md-button class="md-icon-button" ng-click="saveMetadata()">'+
              '<md-icon md-font-set="material-icons">done</md-icon>'+
            '</md-button>'+
            '<md-button class="md-icon-button" ng-click="$parent.metadataFlag=false">'+
              '<md-icon md-font-set="material-icons">close</md-icon>'+
            '</md-button>'+
          '</div>'+
        '</md-toolbar>'+
        //'<md-dialog-content layout="column" layout-padding>'+
        '<div layout-padding>'+
          '<h4>Datos Generales</h4>'+
          '<md-divider></md-divider>'+
          '<div layout="column" layout-align="start stretch" layout-padding>'+
            '<md-input-container>'+
              '<label>Título</label>'+
              '<input ng-model="metadata.objName"/>'+
            '</md-input-container>'+
            '<md-input-container>'+
              '<label>Descripción</label>'+
              '<input ng-model="metadata.objDescription"/>'+
            '</md-input-container>'+
          '</div>'+
          '<h4>Tags</h4>'+
          '<md-divider></md-divider>'+
          '<md-chips name="Tags" ng-model="metadata.objTags" placeholder="Agregar Tags" layout-padding>'+
          '</md-chips>'+
          '<div ng-if="metadata.objInterface.length">'+
            '<h4>Tipos Documentales</h4>'+
            '<md-divider></md-divider>'+
            '<md-chips ng-model="metadata.objInterface" name="Interfaces" placeholder="Interfaces" readonly="true"  layout-padding>'+
              '<md-chip-template>'+
                '{{map[$chip].objName}}'+
              '</md-chip-template>'+
            '</md-chips>'+
          '</div>'+
        '</div>'+
        //'</md-dialog-content>'+
        /*'<md-dialog-actions>'+
          '<md-button ng-click="close()">'+
            '<md-icon md-font-set="material-icons">close</md-icon>'+
            '<span>cerrar</span>'+
          '</md-button>'+
          '<md-button ng-click="save()" class="md-primary">'+
            '<md-icon md-font-set="material-icons">done</md-icon>'+
            '<span>Guardar</span>'+
          '</md-button>'+
        '</md-dialog-actions>'+*/
      '</form>'/*+
    '</md-dialog>'*/;

  var securityDialogTemplate =
    //'<md-dialog>'+
      '<form class="dialog" ng-submit="saveSecurity()" md-whiteframe="2">'+
        '<md-toolbar>'+
          '<div class="md-toolbar-tools">'+
            '<h2 class="md-title">Editar Seguridad del Documento</h2>'+
            '<span flex></span>'+
            '<md-button class="md-icon-button" ng-click="saveSecurity()">'+
              '<md-icon md-font-set="material-icons">done</md-icon>'+
            '</md-button>'+
            '<md-button class="md-icon-button" ng-click="$parent.securityFlag=false">'+
              '<md-icon md-font-set="material-icons">close</md-icon>'+
            '</md-button>'+
          '</div>'+
        '</md-toolbar>'+
        //'<md-dialog-content>'+
          //'{{security}}'+
          //'{{$parent.selectedAcl}}'+
          '<md-tabs md-autoselect md-dynamic-height="true">'+
            '<md-tab>'+
              '<md-tab-label>'+
                '<md-icon md-font-set="material-icons">settings</md-icon>'+
                '<span style="margin-left: 8px">Opciones Generales</span>'+
              '</md-tab-label>'+
              '<md-tab-body>'+
                  '<div layout="column" layout-align="start stretch" layout-padding>'+
                    '<md-checkbox ng-disabled="copy.objSecurity.inmutable" ng-model="security.inmutable">¿El documento es inmutable?</md-checkbox>'+
                    '<md-checkbox ng-disabled="copy.objSecurity.inmutable" ng-model="$parent.publicRead" ng-change="togglePublicRead()">¿Es público para leer?</md-checkbox>'+
                  '</div>'+
              '</md-tab-body>'+
            '</md-tab>'+
            '<md-tab>'+
              '<md-tab-label>'+
                '<md-icon md-font-set="material-icons">people</md-icon>'+
                '<span style="margin-left: 8px">Grupos</span>'+
              '</md-tab-label>'+
              '<md-tab-body>'+
                '<div layout-padding layout="column" flex>'+
                  '<h4>Propietarios</h4>'+
                  '<md-chips name="owner" placeholder="Agregar Propietarios" md-autocomplete-snap readonly="copy.objSecurity.inmutable" ng-model="owner" md-require-match="true" md-removable="owner.length > 1">'+
                    '<md-autocomplete md-no-cache="true" md-items="item in getGroups(searchText)"  md-search-text="searchText" md-selected-item="selectedItem">'+
                      '<md-item-template>'+
                        '{{item.objName}}'+
                      '</md-item-template>'+
                    '</md-autocomplete>'+
                    '<md-chip-template>'+
                      '{{$chip.objName}}'+
                    '</md-chip-template>'+
                  '</md-chips>'+
                  '<h4>Grupos con Acceso</h4>'+
                  '<md-chips name="acl" md-on-add="$chip._acl={write:false}" md-on-select="$parent.selectedAcl=$chip" placeholder="Agregar Propietarios" md-autocomplete-snap readonly="copy.objSecurity.inmutable" ng-model="acl" md-require-match="true">'+
                    '<md-autocomplete md-no-cache="true" md-items="item in getGroups(searchText)"  md-search-text="searchText" md-selected-item="selectedItem">'+
                      '<md-item-template>'+
                        '{{item.objName}}'+
                      '</md-item-template>'+
                    '</md-autocomplete>'+
                    '<md-chip-template>'+
                      '{{$chip.objName}}'+
                    '</md-chip-template>'+
                  '</md-chips>'+
                '</div>'+
              '</md-tab-body>'+
            '</md-tab>'+
            '<md-tab ng-if="$parent.selectedAcl" md-on-deselect="$parent.$parent.selectedAcl=false">'+
              '<md-tab-label>'+
                '<md-icon md-font-set="material-icons">verified_user</md-icon>'+
                '<span style="margin-left: 8px">{{selectedAcl.objName}}</span>'+
              '</md-tab-label>'+
              '<md-tab-body>'+
                '<div layout-padding layout="column" flex>'+
                  '<md-checkbox ng-model="selectedAcl._acl.write">Edita Metadatos</md-checkbox>'+
                  '<md-divider></md-divider>'+
                  '<div>'+
                    '<h4 class="md-subhead">Configurar para Todas las Propiedades</h4>'+
                    '<div layout="row" layout-align="start stretch">'+
                      '<md-checkbox ng-model="$parent.$parent.readAll" ng-change="aclAllChange()">Leer</md-checkbox>'+
                      '<md-checkbox ng-disabled="!$parent.$parent.readAll" ng-model="$parent.$parent.writeAll" ng-change="aclAllChange()">Escribir</md-checkbox>'+
                    '</div>'+
                  '</div>'+
                  '<md-divider></md-divider>'+
                  '<div ng-if="!$parent.readAll">'+
                    '<h4 class="md-subhead">Configurar Propiedades Infividuales del Documento</h4>'+
                    '<doc-builder-acl-tree acl="selectedAcl._acl.properties" properties="copy"></doc-builder-acl-tree>'+
                  '</div>'+
                '</div>'+
              '</md-tab-body>'+
            '</md-tab>'+
          '</md-tabs>'+
        /*'</md-dialog-content>'+
        '<md-dialog-actions>'+
          '<md-button ng-click="close()">'+
            '<md-icon md-font-set="material-icons">close</md-icon>'+
            '<span>cerrar</span>'+
          '</md-button>'+
          '<md-button ng-click="save()" class="md-primary">'+
            '<md-icon md-font-set="material-icons">done</md-icon>'+
            '<span>Guardar</span>'+
          '</md-button>'+
        '</md-dialog-actions>'+*/
      '</form>';/*+
    '</md-dialog>';*/

  var treeTemplate =
    '<md-list flex ng-switch="schema.type" layout="column">'+
      '<md-menu-item layout="column" ng-repeat="item in iteration">'+
        //'{{item}}'+
        '<div layout="row" flex layout-align="start center" md-ink-ripple="#9A9A9A" md-colors="{color: selected.parent == ngModel && selected.key == item.key?\'primary-700\':\'grey-800\', background: selected.parent == ngModel && selected.key == item.key?\'primary-200-0.2\':\'background\'}" ng-click="select(item.key)" ng-dblclick="select(item.key, true)">'+
          '<md-icon md-font-set="material-icons">{{item.schema.objImplements?\'insert_drive_file\':types[item.schema.type].icon}}</md-icon>'+
          '<span class="lbl" layout-padding>{{item.label}}:</span>'+
          '<span flex layout-padding  md-colors="{color: selected.parent == ngModel && selected.key == item.key?\'primary-700\':\'grey-800\'}" ng-if="!item.tree">{{(item.item.toISOString?item.item.toISOString():item.item)|docName:item.implements:getDocument}}</span>'+
          '<span flex ng-if="item.tree"></span>'+
        '</div>'+
        '<doc-builder-tree types="types" ng-if="item.tree" schema="item.schema" ng-model="item.item" selected="selected"></doc-builder-tree>'+
      '</md-menu-item>'+
    '</md-list>';

  var tabTemplate =
    '<doc-builder-tree flex layout="column" types="types" ng-if="!hideTab && !documentFlag" schema="schema" int-names="intNames" ng-model="ngModel" selected="selected"></doc-builder-tree>'+
    '<form ng-submit="doAction()" ng-if="edit && !hideTab && !documentFlag" ng-switch="selectedSchema.type">'+
      '<div layout="row" ng-switch-when="array" md-whiteframe="2" layout-padding>'+
        '<md-input-container class="schema-type" ng-if="!selected.root&&!interface">'+
          '<label>Tipo Elemento</label>'+
          '<md-select ng-model="selectedSchema.type" ng-change="typeChange()">'+
            '<md-option ng-repeat="(key, val) in types" ng-value="key" layout="row" layout-align="start center">'+
              '<md-icon md-font-set="material-icons">{{val.icon}}</md-icon>'+
              '<span flex layout-padding>{{val.desc}}</span>'+
            '</md-option>'+
          '</md-select>'+
        '</md-input-container>'+
        '<md-button type="submit">'+
          'Agregar Item'+
        '</md-button>'+
        '<md-button ng-click="clear()">'+
          'Vaciar Conjunto'+
        '</md-button>'+
        '<span flex></span>'+
        '<md-button ng-if="!selected.root && !selectedSchema.required" class="md-icon-button" ng-click="delete()">'+
          '<md-icon md-font-set="material-icons">delete</md-icon>'+
        '</md-button>'+
      '</div>'+
      '<div layout="row" ng-switch-when="object" md-whiteframe="2" layout-padding>'+
        '<md-input-container class="schema-type" ng-if="!selected.root&&!interface">'+
          '<label>Tipo Elemento</label>'+
          '<md-select ng-model="selectedSchema.type"  ng-change="typeChange()">'+
            '<md-option ng-repeat="(key, val) in types" ng-value="key" layout="row" layout-align="start center">'+
              '<md-icon md-font-set="material-icons">{{val.icon}}</md-icon>'+
              '<span flex layout-padding>{{val.desc}}</span>'+
            '</md-option>'+
          '</md-select>'+
        '</md-input-container>'+
        '<md-input-container ng-if="!interface">'+
          '<label>Etiqueta</label>'+
          '<input ng-model="selected.new" required/>'+
        '</md-input-container>'+
        '<md-button type="submit" ng-if="!interface">'+
          'Agregar'+
        '</md-button>'+
        '<md-button ng-click="clear()" ng-if="!interface">'+
          'Vaciar Formulario'+
        '</md-button>'+
        '<span flex></span>'+
        '<md-button  ng-if="!selected.root && !selectedSchema.required" class="md-icon-button" ng-click="delete()">'+
          '<md-icon md-font-set="material-icons">delete</md-icon>'+
        '</md-button>'+
      '</div>'+
      '<div layout="row" ng-switch-default md-whiteframe="2" layout-padding>'+
        '<md-input-container class="schema-type" ng-if="!selected.root&&!interface">'+
          '<label>Tipo Elemento</label>'+
          '<md-select ng-model="selectedSchema.type"  ng-change="typeChange()">'+
            '<md-option ng-repeat="(key, val) in types" ng-value="key" layout="row" layout-align="start center">'+
              '<md-icon md-font-set="material-icons">{{val.icon}}</md-icon>'+
              '<span flex layout-padding>{{val.desc}}</span>'+
            '</md-option>'+
          '</md-select>'+
        '</md-input-container>'+
        '<md-input-container ng-if="selectedSchema.type!=\'boolean\' && !selectedSchema.objImplements">'+
          '<label>Valor</label>'+
          '<input ng-model="selected.parent[selected.key]" type="{{selectedSchema.format==\'date-time\'?\'datetime\':selectedSchema.type}}"/>'+
        '</md-input-container>'+
        '<md-checkbox ng-model="selected.parent[selected.key]" layout="row" layout-align="center center" ng-if="selectedSchema.type==\'boolean\' && !selectedSchema.objImplements">'+
          '<div layout-fill>{{selected.key}}</div>'+
        '</md-checkbox>'+
        '<md-button class="md-raised" ng-click="editDocument($event)" ng-if="selectedSchema.objImplements && selected.parent[selected.key]">Editar Documento</md-button>'+
        '<md-button class="md-raised" ng-click="selectDocument($event)" ng-if="selectedSchema.objImplements">{{selected.parent[selected.key]?\'Cambiar\':\'Seleccionar\'}} Documento</md-button>'+
        '<span flex></span>'+
        '<md-button ng-if="!selected.root && !selectedSchema.required" class="md-icon-button" ng-click="delete()">'+
          '<md-icon md-font-set="material-icons">delete</md-icon>'+
        '</md-button>'+
      '</div>'+
    '</form>'+
    '<div ng-if="documentFlag">'+
    documentDialogTemplate+
    '</div>';

  var template=
    '<form name="mainForm" md-whiteframe="2" layout-padding>'+
      '<div layout="column" layout-align="center stretch" flex layout-padding>'+
        '<div layout="row" flex layout-align="start center">'+
          '<div ng-repeat="level in stack" layout="row" layout-align="start center">'+
            '<div class="lvl">{{level.copy.objName}}</div>'+
            '<md-icon md-font-set="material-icons">chevron_right</md-icon>'+
          '</div>'+
          '<div class="lvl" md-colors="{color: \'primary\'}">{{copy.objName}}</div>'+
          '<span flex></span>'+
          //'{{copy}}'+
          '<md-button class="md-icon-button" ng-if="!locked" ng-click="$parent.locked=true">'+
            '<md-icon md-font-set="material-icons">lock</md-icon>'+
          '</md-button>'+
          '<md-button class="md-icon-button" ng-if="!locked" ng-click="goBack()">'+
            '<md-icon md-font-set="material-icons">arrow_back</md-icon>'+
          '</md-button>'+
          '<md-button class="md-icon-button" ng-if="locked" ng-click="doSave(mainForm)">'+
            '<md-icon md-font-set="material-icons">done</md-icon>'+
          '</md-button>'+
          '<md-button class="md-icon-button" ng-if="locked" ng-click="doCancel()">'+
            '<md-icon md-font-set="material-icons">clear</md-icon>'+
          '</md-button>'+
          '<md-button class="md-icon-button" ng-if="locked" ng-click="editMetadata($event)">'+
            '<md-icon md-font-set="material-icons">edit</md-icon>'+
          '</md-button>'+
          '<md-button class="md-icon-button" ng-if="locked" ng-click="editSecurity($event)">'+
            '<md-icon md-font-set="material-icons">security</md-icon>'+
          '</md-button>'+
        '</div>'+
        '<div class="md-caption" flex>{{copy.objDescription}}</div>'+
      '</div>'+
    '</form>'+
    '<md-tabs flex md-dynamic-height="false" md-autoselect="true" ng-if="!metadataFlag && !securityFlag">'+
      '<md-tab ng-repeat="interface in copy.objInterface">'+
        '<md-tab-label>{{getName(interface).plain}}</md-tab-label>'+
        '<md-tab-body>'+
          '<md-tab-content flex layout="column">'+
            '<doc-builder-tab flex layout="column" ng-model="copy[getName(interface).key]" edit="edit && locked" interface="map[interface]"></doc-builder-tab>'+
          '</md-tab-content>'+
        '</md-tab-body>'+
      '</md-tab>'+
      '<md-tab label="base">'+
        '<md-tab-content flex layout="column">'+
          '<doc-builder-tab flex layout="column" ng-model="copy" edit="edit && locked" interfaceList="interfaces" int-names="intNames"></doc-builder-tab>'+
        '</md-tab-content>'+
      '</md-tab>'+
      '<md-tab ng-disabled="!locked" flex>'+
        '<md-tab-label><md-icon md-font-set="material-icons">library_add</md-icon></md-tab-label>'+
        '<md-tab-body>'+interfaceDialogTemplate+'</md-tab-body>'+
      '</md-tab>'+
    '</md-tabs>'+
    '<div ng-if="metadataFlag">'+
    metadataDialogTemplate+
    '</div>'+
    '<div ng-if="securityFlag">'+
    securityDialogTemplate+
    '</div>'/*+
    '<div layout="row">'+
      '<md-button ng-if="copy.objInterface && copy.objInterface.length" ng-repeat="interface in copy.objInterface" ng-class="{\'md-primary\': selectedInterface == interface}" ng-click="selectInterface(interface)">{{getName(interface).plain}}</md-button>'+
      '<md-button ng-click="selectInterface()" ng-class="{\'md-primary\': !selectedInterface}">'+
        'base'+
      '</md-button>'+
      '<md-button class="md-icon-button" ng-if="implementable.length" ng-click="addInterface($event)">'+
        '<md-icon md-font-set="material-icons">library_add</md-icon>'+
      '</md-button>'+
      '<span flex></span>'+
      '<md-chips>'+
        '<md-chip ng-repeat="tag in copy.objTags" ng-if="$index <= 4">{{tag}}</md-chip>'+
      '</md-chips>'+
      '<div layout="column" layout-align="end center"><md-icon md-font-set="material-icons" ng-if="copy.objTags && copy.objTags.length > 5">more_horiz</md-icon></div>'+
    '</div>'+
    '<doc-builder-tab flex layout="column" ng-model="copy[getName(interface).key]" ng-show="selectedInterface==interface" edit="edit" ng-repeat="interface in copy.objInterface" interface="map[interface]"></doc-builder-tab>'+
    '<doc-builder-tab flex layout="column" ng-model="copy" ng-show="!selectedInterface" edit="edit" interfaceList="interfaces" int-names="intNames"></doc-builder-tab>'*/;


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
    if(angular.isUndefined(element)||element === null) return;
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
  .filter('objFilter', function() {
    return function(obj, evalFn) {
      var filtered={};
      for(var i in obj) {
        if(evalFn(obj[i], i, obj)) {
          filtered[i]=obj[i];
        }
      }
      return filtered;
    };
  })
  .filter('docName', function() {
    var filterFn = function(text, hasImplements, toNameFn) {
      if(!text || !hasImplements) return text;
      return toNameFn(text);
    };
    filterFn.$stateful=true;
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
        search: '&?',
        interfaces: '=?',
        implementable: '=?'
      },
      controller: function($scope, $mdToast, $mdDialog, $filter, $q) {
        if(!$scope.interfaces) $scope.interfaces=[];
        $scope.locked = false;
        $scope.stack = [];
        $scope.selectedAcl = null;
        $scope.readAll = false;
        $scope.writeAll = false;
        $scope.$watchCollection('ngModel', function(value) {
          $scope.copy = angular.merge({objName: 'Sin Título'}, value);
        });

        $scope.$watchCollection('copy.objInterface', function(value) {
          $scope.intNames = (value||[]).map(function(id) {
            return $scope.getName(id).key;
          });
        });

        $scope.$watch('interfaces', function(value) {
          $scope.map = {};
          $scope.nMap = {};
          (value||[]).forEach(function(iface) {
            $scope.map[iface._id] = iface;
            $scope.nMap[iface.objName] = iface;
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
/*          mainForm.documentName.$setDirty();
          mainForm.documentName.$setTouched();*/
          if(isEmpty($scope.copy.objName)) {
            return $mdToast.showSimple('Debe Proporcionar un Nombre para el Documento.');
          }
          if(isEmpty($scope.copy)) {
            return $mdToast.showSimple('El documento no puede estar vacío.');
          }
          var error;
          $scope.copy.objInterface && $scope.copy.objInterface.forEach(function(interfaceId) {
            if(error) return;
            if((error = failConstraints($scope.copy[$scope.getName(interfaceId).key], $scope.map[interfaceId]))) {
              $scope.selectInterface(interfaceId);
              $scope.dirty = true;
              return $mdToast.showSimple(error);
            }
          });
          if(error) return;
          if(!$scope.stack.length) {
            for(var i in $scope.ngModel) {
              delete $scope.ngModel[i];
            }
            angular.copy($scope.copy, $scope.ngModel);
            $scope.done({canceled: false});
          } else {
            $scope.done({canceled: false, doc: $scope.copy})
            .then(function(doc) {
              $scope.$emit('docBuilder:backStack', doc._id);
            });
          }
        };

        $scope.goBack = function(){
          if(!$scope.stack.length) return $scope.done({canceled: true});
          $scope.$emit('docBuilder:backStack');
        };

        $scope.doCancel = function() {
          $scope.copy = angular.merge({objName: 'Sin Título'}, $scope.ngModel);
          $scope.locked = false;
        };

        $scope.addInterface = function(iface) {
          if(!$scope.copy.objInterface) $scope.copy.objInterface = [];
          $scope.copy.objInterface.push(iface._id);
        };

        $scope.saveMetadata = function() {
          $scope.metadataFlag = false;
          angular.merge($scope.copy, $scope.metadata);
        };

        $scope.editMetadata = function($event) {
          $scope.metadataFlag = !$scope.metadataFlag;
          if($scope.metadataFlag) {
            $scope.securityFlag = false;
            $scope.metadata = angular.merge({objTags: [], objInterface: []}, $scope.copy);
          }
        };

        $scope.togglePublicRead = function() {
          if(!$scope.security.acl) $scope.security.acl = {};
          if($scope.publicRead) {
            if(!$scope.acl.map(function(a) {return a._id;}).includes('group:public')) $scope.acl.push({_id: 'group:public', objName: 'Público', _acl: {write: false}});
          } else {
            $scope.acl = $scope.acl.filter(function(a) {
              return a._id != 'group:public';
            });
          }
        };

        $scope.getGroups = function(search) {
          var filter = {
            objName: {$regex: search, $options: 'i'},
            objInterface: $scope.nMap.GroupInterface._id
          };
          return $q(function(resolve, reject) {
            $scope.$emit('docBuilder:search', filter, function(err, list) {
              if(err) return reject(err);
              var oid = $scope.owner.map(function(owner) {
                return owner._id;
              });
              resolve(list.filter(function(item) {
                return !oid.includes(item._id);
              }));
            });
          });
        };

        $scope.editSecurity = function($event) {
          $scope.securityFlag = !$scope.securityFlag;
          $scope.owner=[];
          $scope.acl=[];
          if($scope.securityFlag) {
            $scope.metadataFlag = false;
            $scope.security = angular.merge({}, $scope.copy.objSecurity);
            if((($scope.security||{}).owner||[]).length) {
              $scope.$emit('docBuilder:search', {_id: {$in: $scope.security.owner}}, function(err, list) {
                if(!err) $scope.owner = list;
              });
            }
            if(!isEmpty($scope.security.acl)) {
              if($scope.security.acl['group:public']) $scope.acl.push({_id: 'group:public', objName: 'Público', _acl: $scope.security.acl['group:public']});
              var ids = Object.keys($scope.security.acl).filter(function(k){
                return k!='group:public';
              });
              if(ids.length) $scope.$emit('docBuilder:search', {_id: {$in: ids}}, function(err, list) {
                if(!err) list.forEach(function(d) {
                  d._acl = $scope.security.acl[d._id];
                  $scope.acl.push(d);
                });
              });
            }
          }
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

        $scope.$on('docBuilder:search', function($event, filter, cb) {
          $event.stopPropagation();
          $scope.search({filter: filter})
            .then(function(list) {
              cb(null, list);
            })
            .catch(function(err) {
              cb(err);
            });
        });

        $scope.$on('docBuilder:getDocument', function($event, id, cb) {
          $event.stopPropagation();
          $scope.search({filter: id, one: true})
            .then(function(doc) {
              cb(null, doc);
            })
            .catch(function(err) {
              cb(err);
            });
        });

        $scope.$on('docBuilder:addStack', function($event, selected, model) {
          $scope.stack.push({copy: $scope.copy, selectedInterface: $scope.selectedInterface, selected: selected, locked: $scope.locked});
          $scope.copy = model;
          $scope.selectedInterface = model.objInterface&&model.objInterface[0]||null;
          $scope.locked = false;
        });

        $scope.$on('docBuilder:backStack', function($event, value) {
          if(!$scope.stack.length) return;
          var level = $scope.stack.pop();
          $scope.copy = level.copy;
          $scope.selectedInterface = level.selectedInterface;
          $scope.locked = level.locked;
          if(value) {
            level.selected.parent[level.selected.key] = value;
          }
          $scope.$broadcast('docBuilder:select', level.selected);
        });
        $scope.aclAllChange = function() {
          if($scope.readAll) $scope.selectedAcl._acl.properties = {'properties:all': $scope.writeAll};
          else $scope.selectedAcl._acl.properties = {};
        };
      }
    };
  })
  .directive('docBuilderTab', function($compile, $injector) {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        interface: '=',
        interfaceList: '=',
        edit: '<?',
        intNames: "="
      },
      template: tabTemplate,
      compile: function() {
        return {
          pre: function(scope, element) {
            scope.edit = angular.isUndefined(scope.edit)||scope.edit;
            if(scope.interface && scope.interface.objName) {
              var directiveName = scope.interface.objName.replace(/^\w/, function(x) {return x.toLowerCase();})+'Directive';
              if($injector.has(directiveName)) {
                scope.hideTab = true;
                var tagName = scope.interface.objName.match(/([A-Za-z][a-z0-9]*)/g).join('-').toLowerCase();
                var directive = $compile('<'+tagName+' ng-model="ngModel" interface="interface" edit="edit"></'+tagName+'>')(scope);
                element.append(directive);
              }
            }
          }
        };
      },
      controller: function($scope, $mdDialog) {
        if(!$scope.ngModel) $scope.ngModel = {};
        $scope.$watch('ngModel', function(value) {
          if($scope.interface) {
            $scope.schema = angular.merge({}, $scope.interface);
            if(isEmpty(value)) $scope.ngModel = buildDocument($scope.schema);
          } else if(!$scope.interface || ((!$scope.interface.properties||isEmpty($scope.interface.properties)) && (!$scope.interface.items||isEmpty($scope.interface.items)))) {
            $scope.schema = buildSchema(value);
          }
          if(!$scope.schema) $scope.schema = {type: 'object'};
          if(!$scope.selected||$scope.selected.root) $scope.$emit('docBuilder:select', (value.objInterface&&value.objInterface.length&&value.objInterface[0])||null);
        });

        $scope.$on('docBuilder:select', function($event, value, dblck) {
          if($event.stopPropagation) $event.stopPropagation();
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
          if(dblck) {
            if($scope.selectedSchema.objImplements) {
              $scope.editDocument();
            }
          }
        });

        $scope.docSearch = function() {
          if(!$scope.docSearchText.length) return ($scope.searchDocumentList=[]);
          var filter = {
            objName: {$regex: $scope.docSearchText, $options: 'i'}
          };
          $scope.$emit('docBuilder:search', filter, function(err, list) {
            $scope.searchDocumentList = list;
          });
        };

        $scope.addDocument = function(doc) {
          $scope.selected.parent[$scope.selected.key] = doc._id;
          $scope.documentFlag = false;
        };

        $scope.selectDocument = function($event) {
          $scope.documentFlag = !$scope.documentFlag;
          /*var self = $scope;
          $mdDialog.show({
            template: documentDialogTemplate,
            targetEvent: $event,
            clickOutsideToClose: true,
            controller: function($scope, $mdDialog, interfaces) {
              $scope.interfaces = interfaces;
              $scope.add = function(doc) {
                $mdDialog.hide(doc);
              };
              $scope.new = function(doc) {
                $mdDialog.hide();
              };
              $scope.close = function() {
                $mdDialog.cancel();
              };
              $scope.doSearch = function() {
                if(!$scope.search.length) return ($scope.documentList=[]);
                var filter = {
                  objName: {$regex: $scope.search, $options: 'i'}
                };
                self.$emit('docBuilder:search', filter, function(err, list) {
                  $scope.documentList = list;
                });
              };
            }
          })
          .then(function(doc) {
            if(doc) return ($scope.selected.parent[$scope.selected.key] = doc._id);
            $scope.$emit('docBuilder:addStack', $scope.selected, {objName: 'Sin Título'});
          });*/
        };

        $scope.editDocument = function() {
          $scope.$emit('docBuilder:getDocument', $scope.selected.parent[$scope.selected.key], function(err, doc) {
            $scope.$emit('docBuilder:addStack', $scope.selected, doc);
          });
        };

        $scope.types = {
          'array': {desc: 'Conjunto', icon: 'format_list_numbered'},
          'date': {desc: 'Fecha/Hora', icon: 'date_range'},
          'object': {desc: 'Formulario', icon: 'view_list'},
          'number': {desc: 'Número', icon: 'plus_one'},
          'string': {desc: 'Texto', icon: 'text_fields'},
          'boolean': {desc: 'Verdadero/Falso', icon: 'indeterminate_check_box'}
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
        selected: '=',
        intNames: "=?",
        types: "<"
      },
      controller: function($scope, $filter) {
        $scope.getType = getType;
        $scope.isEmpty = isEmpty;

        $scope.select = function(key, dblck) {
          var element = {parent: $scope.ngModel, key: key, schema: $scope.schema};
          if(!dblck && $scope.selected.parent == element.parent && $scope.selected.key == element.key) {
            element = null;//{parent: null, key: null, schema: null};
          }
          $scope.$emit('docBuilder:select', element, dblck);
        };

        $scope.$watch('intNames', function(value) {
          if(value) {
            $scope.keyFilter = function(item, index, obj) {
              if(index=='_id'||index.match(/^obj/)||value.indexOf(index) !== -1) return false;
              return true;
            };
          } else {
            $scope.keyFilter = function() {
              return true;
            };
          }
        });

        var createIterable = function() {
          if(!$scope.schema && $scope.ngModel) $scope.schema = {type: getType($scope.ngModel)};
          $scope.iteration = [];
          switch($scope.schema.type) {
            case 'array':
              ($scope.ngModel||[]).forEach(function(item, i) {
                var it = {key: i, label: i+1, item: item};
                if($scope.schema.items) {
                  switch(getType($scope.schema.items)) {
                    case "array":
                      if($scope.schema.items[i]) it.schema = $scope.schema.items[i];
                      break;
                    case "object":
                      it.schema = $scope.schema.items;
                  }
                }
                if(!it.schema) it.schema = {type: getType(item)};
                it.tree= ['array', 'object'].indexOf(it.schema.type) !== -1;
                it.implements = !!it.schema.objImplements;
                $scope.iteration.push(it);
              });
              break;
            case 'object':
              for(var i in $filter('objFilter')($scope.ngModel, $scope.keyFilter)) {
                (function(i, item) {
                  var it = {key: i, label: i, item: item};
                  it.schema = ($scope.schema.properties||{})[i]||{type: getType(item)};
                  it.tree= ['array', 'object'].indexOf(it.schema.type) !== -1;
                  it.implements = !!it.schema.objImplements;
                  $scope.iteration.push(it);
                })(i, $scope.ngModel[i]);
              }
              break;
          }
        };

        $scope.$watchCollection('ngModel', function(value, prev) {
          console.log('v: %j',value);
          console.log('p: %j',prev);
          createIterable(value);
        });
        $scope.$watchCollection('schema', createIterable);
        var docData = {};
        $scope.getDocument = function(id) {
          if(!docData[id]) {
            $scope.$emit('docBuilder:getDocument', id, function(err, doc) {
              docData[id] = err?{objName: ''}:doc;
            });
            return 'Cargando..';
          }
          return docData[id].objName;
        };
      }
    };
  })
  .directive('docBuilderAclTree', function() {
    return {
      restrict: 'E',
      template: aclTreeTemplate,
      scope: {
        acl:'=',
        properties: '=',
        level: '<?',
        parent: '<?'
      },
      controller: function($scope) {
        $scope.getType = getType;
        $scope.acl = $scope.acl||{};
        $scope.level = ($scope.level||0)+1;
        $scope.parent = ($scope.parent?$scope.parent+'.':'');
        $scope.spaces = [];
        $scope.writable = true;
        var n = 0;
        while(n < $scope.level - 1) {
          $scope.spaces.push(null);
          n++;
        }
        $scope._acl = [];
        $scope.$watch('properties', function(newVal) {
          /*var setKeys = function(elem, parent) {
            parent = parent||[];
            var items = [];*/
            for(var i in newVal) {
              if($scope.level === 1 && i.substr(0, 3) == 'obj') continue;
              /*var p = angular.merge([], parent);
              p.push(i);*/
              var it = {
                key: i,
                path: $scope.parent+i,
                read: typeof $scope.acl[$scope.parent+i]!=='undefined',
                write: typeof $scope.acl[$scope.parent+i]!=='undefined'?$scope.acl[$scope.parent+i]:($scope.writable||true)
              };
              if(getType(newVal[i]) == 'object') {
                it.properties = newVal[i];/*setKeys(elem[i], p);*/
              }
              $scope._acl.push(it);
            }
          //};
          //$scope._acl = setKeys(newVal);
        });
        $scope.$on('docBuilderAclTree:write', function($event, path, write) {
          if(new RegExp(path).test($scope.parent)) {
            $scope.writable = write;
            if(!write) $scope._acl.forEach(function(acl) {
              acl.write = false;
            });
          }
        });
        $scope.aclChange = function(acl) {
          $scope.$broadcast('docBuilderAclTree:write', acl.path, acl.write);
          if(acl.read) return $scope.acl[acl.path] = acl.write;
          delete $scope.acl[acl.path];
        };
      }
    };
  });
})();
