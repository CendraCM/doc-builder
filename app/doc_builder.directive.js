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
            '<div class="interface" layout="column" layout-align="center center" flex ng-repeat="interface in interfaces|filter:ifaceSearch" ng-click="select({iface: interface})">'+
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
            '<h2 class="md-title">Editar Metadatos del {{isSchema()?"Tipo Documental":"Documento"}}</h2>'+
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
            '<h2 class="md-title">Editar Seguridad del {{isSchema()?"Tipo Documental":"Documento"}}</h2>'+
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
                    '<md-checkbox ng-disabled="copy.objSecurity.inmutable" ng-model="security.inmutable">¿El {{isSchema()?"tipo documental":"documento"}} es inmutable?</md-checkbox>'+
                    '<md-checkbox ng-disabled="copy.objSecurity.inmutable" ng-model="security.publicRead" ng-change="togglePublicRead()">¿Es público para leer?</md-checkbox>'+
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
                  '<md-chips name="owner" placeholder="Agregar Propietarios" md-autocomplete-snap readonly="copy.objSecurity.inmutable" ng-model="security._owner" md-require-match="true" md-removable="owner.length > 1">'+
                    '<md-autocomplete md-no-cache="true" md-items="item in getGroups({searchText: searchText, filter: [\'owner\']})"  md-search-text="searchText" md-selected-item="selectedItem">'+
                      '<md-item-template>'+
                        '{{item.objName}}'+
                      '</md-item-template>'+
                    '</md-autocomplete>'+
                    '<md-chip-template>'+
                      '{{$chip.objName}}'+
                    '</md-chip-template>'+
                  '</md-chips>'+
                  '<h4>Grupos con Acceso</h4>'+
                  '<md-chips name="acl" md-on-select="$parent.selectedAcl=$chip" placeholder="Agregar Propietarios" md-autocomplete-snap readonly="copy.objSecurity.inmutable" ng-model="security._acl" md-require-match="true">'+
                    '<md-autocomplete md-no-cache="true" md-items="item in getGroups({searchText: searchText, filter: [\'owner\', \'acl\']})"  md-search-text="searchText" md-selected-item="selectedItem">'+
                      '<md-item-template>'+
                        '{{item.objName}}'+
                      '</md-item-template>'+
                    '</md-autocomplete>'+
                    '<md-chip-template>'+
                      '{{$chip.objName}}'+
                    '</md-chip-template>'+
                  '</md-chips>'+
                  '<div ng-if="isSchema()">'+
                    '<h4>Grupos que pueden Implementar</h4>'+
                    '<md-chips name="imp" placeholder="Agregar Implementadores" md-autocomplete-snap readonly="copy.objSecurity.inmutable" ng-model="security._implementable" md-require-match="true">'+
                      '<md-autocomplete md-no-cache="true" md-items="item in getGroups({searchText: searchText, add: getImplementableReserveWords(), filter: [\'owner\', \'implementable\']})"  md-search-text="searchText" md-selected-item="selectedItem">'+
                        '<md-item-template>'+
                          '{{item.objName}}'+
                        '</md-item-template>'+
                      '</md-autocomplete>'+
                      '<md-chip-template>'+
                        '{{$chip.objName}}'+
                      '</md-chip-template>'+
                    '</md-chips>'+
                  '</div>'+
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
    '<md-list ng-switch="schema.type" layout="column">'+
      '<md-menu-item layout="column" ng-repeat="item in iteration">'+
        //'{{item}}'+
        '<div layout="row" class="leaf" flex layout-align="start center" ng-click="select($event, item)" ng-dblclick="select($event, item, true)" md-ink-ripple="#9A9A9A" md-colors="{color: selected.parent == ngModel && selected.key == item.key?\'primary-700\':\'grey-800\', background: selected.parent == ngModel && selected.key == item.key?\'primary-200-0.2\':\'background\'}">'+
          '<form layout="row" layout-align="start center" ng-submit="changeValue($event, item)">'+
            '<md-menu>'+
              '<md-button class="md-icon-button" ng-disabled="item.schema.objImplements||!edit" ng-click="openMenu($event, item.key, $mdOpenMenu)">'+
                '<md-icon md-font-set="material-icons">{{item.schema.objImplements?\'insert_drive_file\':types[item._type].icon}}</md-icon>'+
              '</md-button>'+
              '<md-menu-content>'+
                '<md-menu-item ng-repeat="(key, type) in types">'+
                  '<md-button ng-click="item._type = key">'+
                    '<md-icon md-font-set="material-icons">{{type.icon}}</md-icon>'+
                    '<span>{{type.desc}}</span>'+
                  '</md-button>'+
                '</md-menu-item>'+
              '</md-menu-content>'+
            '</md-menu>'+
            '<span class="lbl" ng-if="!edit||!item.editLabel||!editSchema||selected.schema.type != \'object\'" ng-click="editLabel($event, item)" layout-padding>{{item.label}}:</span>'+
            '<md-input-container ng-if="edit&&item.editLabel&&editSchema&&selected.schema.type == \'object\'">'+
              '<input ng-model="item._key" focus-me="true" ng-click="$event.stopPropagation()" aria-label="{{item.label}} Key" required/>'+
            '</md-input-container>'+
            '<span layout-padding  md-colors="{color: \'grey-800\'}" ng-if="(!edit || selected.key != item.key) && !item.tree && !isSchema && item.schema.type != \'boolean\'">'+
              '{{(item.item.toISOString?item.item.toISOString():item.item)|docName:item.implements:getDocument}}'+
            '</span>'+
            '<md-input-container ng-if="edit && selected.key == item.key && !item.tree && !isSchema && !item.implements && ![\'boolean\', \'object\', \'array\'].includes(item._type)">'+
              '<input ng-model="item._item" focus-me="true" type="{{item._type}}" ng-click="$event.stopPropagation()" aria-label="{{item.label}} Value"/>'+
            '</md-input-container>'+
            '<md-checkbox ng-model="item._item" layout="row" layout-align="center center" ng-disabled="!edit" ng-if="!item.tree && !isSchema && item._type == \'boolean\'" aria-label="{{item.label}} Value"></md-checkbox>'+
            '<span ng-if="isSchema">{{types[item._type].desc}}</span>'+
            '<md-button class="md-icon-button" ng-if="selected.key == item.key && edit && editSchema" type="submit">'+
              '<md-icon md-font-set="material-icons">done</md-icon>'+
            '</md-button>'+
            '<md-button class="md-icon-button" ng-if="selected.key == item.key && edit && editSchema" ng-click="clearItem($event, item)">'+
              '<md-icon md-font-set="material-icons">clear</md-icon>'+
            '</md-button>'+
            '<md-button class="md-icon-button" ng-if="selected.key == item.key && edit && editSchema" ng-click="delete()">'+
              '<md-icon md-font-set="material-icons">delete</md-icon>'+
            '</md-button>'+
            '<span flex></span>'+
          '</form>'+
        '</div>'+
        '<doc-builder-tree types="types" ng-if="item.tree" schema="item.schema" ng-model="item.item" selected="selected" is-schema="isSchema" edit-schema="editSchema" edit="edit"></doc-builder-tree>'+
      '</md-menu-item>'+
    '</md-list>';

  var tabTemplate =
    '<md-content flex ng-if="!documentFlag">'+
      '<doc-builder-tree layout="column" edit-schema="!interface" edit="edit" types="types" ng-if="!hideTab && !documentFlag && !selectInterfaceFlag" schema="schema" int-names="intNames" ng-model="ngModel" selected="selected" is-schema="isSchema"></doc-builder-tree>'+
      '<doc-builder-iface-selector ng-if="selectInterfaceFlag" interfaces="interfaceList" select="addInterface(iface)"></doc-builder-iface-selector>'+
    '</md-content>'+
    '<form ng-submit="doAction($event)" ng-if="edit && !hideTab && !documentFlag" ng-switch="selectedSchema.type">'+
      '<div layout="row" ng-switch-when="array" md-whiteframe="2" layout-padding layout-align="start center">'+
        '<md-button type="submit" ng-disabled="isSchema && selected.equalItems && selected.parent[selected.key].length > 0">'+
          'Agregar Item'+
        '</md-button>'+
        '<md-button ng-click="clear()">'+
          'Vaciar Conjunto'+
        '</md-button>'+
        '<md-checkbox ng-model="selected.equalItems" ng-change="changeEqualItems()">Items Iguales</md-checkbox>'+
        '<span flex></span>'+
      '</div>'+
      '<div layout="row" ng-switch-when="object" md-whiteframe="2" layout-padding>'+
        '<md-input-container ng-if="!interface">'+
          '<label>Etiqueta</label>'+
          '<input ng-model="selected.new" class="label-input" required/>'+
        '</md-input-container>'+
        '<md-button type="submit" ng-if="!interface">'+
          'Agregar'+
        '</md-button>'+
        '<md-button ng-click="clear()" ng-if="!interface">'+
          'Vaciar Formulario'+
        '</md-button>'+
        '<span flex></span>'+
      '</div>'+
      '<div layout="row" ng-switch-default md-whiteframe="2" layout-padding>'+
        '<md-button class="md-raised" ng-click="editDocument($event)" ng-if="!isSchema && selectedSchema.objImplements && testVal()">Editar Documento</md-button>'+
        '<md-button class="md-raised" ng-click="selectDocument($event)" ng-if="!isSchema && selectedSchema.objImplements">{{selected.parent[selected.key]?\'Cambiar\':\'Seleccionar\'}} Documento</md-button>'+
        '<md-switch ng-if="!selected.root&&!interface&&selectedSchema.type == \'string\'" ng-model="selected._doImplement">Implementa Interfaces?</md-switch>'+
        '<md-chips name="owner" md-on-add="implementInterface($chip)" placeholder="Interfaces" ng-if="selected._doImplement" md-autocomplete-snap readonly="selected.root || interface" ng-model="selected._implements" md-require-match="true">'+
          '<md-autocomplete md-no-cache="true" md-items="item in implementable|map:nameToString|filter:searchText"  md-search-text="searchText" md-selected-item="selectedItem">'+
            '<md-item-template>'+
              '{{item}}'+
            '</md-item-template>'+
          '</md-autocomplete>'+
          '<md-chip-template>'+
            '{{$chip}}'+
          '</md-chip-template>'+
        '</md-chips>'+
        '<span flex></span>'+
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
          '{{copy}}'+
          '<md-button class="md-icon-button" ng-if="!locked" ng-click="doLock()">'+
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
    '<md-tabs flex md-dynamic-height="false" md-autoselect="true" ng-if="!metadataFlag && !securityFlag" md-selected="selectedInterface">'+
      '<md-tab ng-repeat="interface in copy.objInterface">'+
        '<md-tab-label>'+
          '<span>{{getName(interface).plain}}</span>'+
          '<tab-remove ng-if="locked && $index == selectedInterface" ng-click="removeInterface($event, interface)"></tab-remove>'+
          //'<md-icon md-font-set="material-icons" ng-if="locked" ng-click="removeInterface($event, interface)">close</md-icon>'+
        '</md-tab-label>'+
        '<md-tab-body>'+
          '<md-tab-content flex layout="column">'+
            '<doc-builder-tab flex layout="column" active="$index==selectedInterface" ng-model="copy[getName(interface).key]" edit="edit && locked" interface="map[interface]" interfaceList="interfaces" implementable="implementable"></doc-builder-tab>'+
          '</md-tab-content>'+
        '</md-tab-body>'+
      '</md-tab>'+
      '<md-tab label="propiedades">'+
        '<md-tab-content flex layout="column">'+
          '<doc-builder-tab flex layout="column" active="$index==copy.objInterface.length" ng-model="propertiesModel" edit="edit && locked" interfaceList="interfaces" implementable="implementable" int-names="intNames" is-schema="isSchema()"></doc-builder-tab>'+
        '</md-tab-content>'+
      '</md-tab>'+
      '<md-tab ng-disabled="!locked" ng-if="!isSchema()" flex>'+
        '<md-tab-label><md-icon md-font-set="material-icons">library_add</md-icon></md-tab-label>'+
        '<md-tab-body><doc-builder-iface-selector interfaces="implementable" select="addInterface(iface)"></doc-builder-iface-selector></md-tab-body>'+
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


  var deepCompare = function() {
    var i, l, leftChain, rightChain;

    function compare2Objects (x, y) {
      var p;

      // remember that NaN === NaN returns false
      // and isNaN(undefined) returns true
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
           return true;
      }

      // Compare primitives and functions.
      // Check if both arguments link to the same object.
      // Especially useful on the step where we compare prototypes
      if (x === y) {
          return true;
      }

      // Works in case when functions are created in constructor.
      // Comparing dates is a common scenario. Another built-ins?
      // We can even handle functions passed across iframes
      if ((typeof x === 'function' && typeof y === 'function') ||
         (x instanceof Date && y instanceof Date) ||
         (x instanceof RegExp && y instanceof RegExp) ||
         (x instanceof String && y instanceof String) ||
         (x instanceof Number && y instanceof Number)) {
          return x.toString() === y.toString();
      }

      // At last checking prototypes as good as we can
      if (!(x instanceof Object && y instanceof Object)) {
          return false;
      }

      if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
          return false;
      }

      if (x.constructor !== y.constructor) {
          return false;
      }

      if (x.prototype !== y.prototype) {
          return false;
      }

      // Check for infinitive linking loops
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
           return false;
      }

      // Quick checking of one object being a subset of another.
      // todo: cache the structure of arguments[0] for performance
      for (p in y) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
              return false;
          }
          else if (typeof y[p] !== typeof x[p]) {
              return false;
          }
      }

      for (p in x) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
              return false;
          }
          else if (typeof y[p] !== typeof x[p]) {
              return false;
          }

          switch (typeof (x[p])) {
              case 'object':
              case 'function':

                  leftChain.push(x);
                  rightChain.push(y);

                  if (!compare2Objects (x[p], y[p])) {
                      return false;
                  }

                  leftChain.pop();
                  rightChain.pop();
                  break;

              default:
                  if (x[p] !== y[p]) {
                      return false;
                  }
                  break;
          }
      }

      return true;
    }

    if (arguments.length < 1) {
      return true; //Die silently? Don't know how to handle such case, please help...
      // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
  };

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
    if(angular.isUndefined(element)||element === null) return {type: 'string'};
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
    var document = getType(schema.default)=='undefined'?null:schema.default;
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
  .filter('map', function() {
    return function(source, mapFn) {
      if(!Array.isArray(source)) return [];
      return source.map(mapFn);
    };
  })
  .directive('docBuilder', function() {
    return {
      restrict: 'E',
      template: template,
      scope: {
        ngModel: '=?',
        edit: '<?',
        done: '&',
        search: '&?',
        lock: '&?',
        interfaces: '=?',
        implementable: '=?',
        schema: '=?'
      },
      controller: function($scope, $mdToast, $mdDialog, $filter, $q, $timeout) {
        if(!$scope.interfaces) $scope.interfaces=[];
        $scope.stack = [];
        $scope.selectedAcl = null;
        $scope.readAll = false;
        $scope.writeAll = false;
        $scope.propertiesModel = null;
        $scope.selectedInterface = 0;

        $scope.isSchema = function() {
          return !$scope.ngModel && $scope.schema;
        };

        $scope.$watchCollection('ngModel', function(value) {
          if($scope.isSchema()) return;
          $scope.copy = angular.merge({objName: 'Sin Título', objLocal:{}}, value);
          $scope.locked = !value._id;
          $scope.propertiesModel = $scope.copy.objLocal;
        });

        $scope.$watchCollection('schema', function(value) {
          if(!$scope.isSchema()) return;
          $scope.copy = angular.merge({objName: 'Sin Título', properties:{}}, value);
          $scope.locked = !value._id;
          $scope.propertiesModel = $scope.copy.properties;
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

        $scope.doLock = function() {
          if($scope.lock) {
            $scope.lock({lock: true, id: $scope.ngModel._id})
            .then(function() {
              $scope.locked=true;
            })
            .catch(function(err) {
              $scope.locked=false;
              $mdToast.showSimple(err);
            });
          } else {
            $scope.locked=true;
          }
        };

        $scope.doSave = function(mainForm) {
          if(isEmpty($scope.copy.objName)) {
            return $mdToast.showSimple('Debe Proporcionar un Nombre para el Documento.');
          }
          if(($scope.isSchema() && isEmpty($scope.copy)) || (!$scope.isSchema() && isEmpty($scope.copy.objInterface) && isEmpty($scope.copy.objLocal))) {
            return $mdToast.showSimple('El documento no puede estar vacío.');
          }
          var error;
          !$scope.isSchema() && $scope.copy.objInterface && $scope.copy.objInterface.forEach(function(interfaceId) {
            if(error) return;
            if((error = failConstraints($scope.copy[$scope.getName(interfaceId).key], $scope.map[interfaceId]))) {
              $scope.selectInterface(interfaceId);
              $scope.dirty = true;
              return $mdToast.showSimple(error);
            }
          });
          if(error) return;
          if($scope.isSchema() || !$scope.stack.length) {
            var e = $scope.isSchema()?$scope.schema:$scope.ngModel;
            for(var i in e) {
              delete e[i];
            }
            angular.copy($scope.copy, e);
            $scope.done({canceled: false});
          } else {
            $scope.done({canceled: false, doc: $scope.copy})
            .then(function(doc) {
              $scope.$emit('docBuilder:backStack', doc._id);
            });
          }
        };

        $scope.goBack = function(){
          if($scope.isSchema() || !$scope.stack.length) return $scope.done({canceled: true});
          $scope.$emit('docBuilder:backStack');
        };

        $scope.doCancel = function() {
          var e = $scope.isSchema()?$scope.schema:($scope.stack.length?$scope.stack[$scope.stack.length-1].model:$scope.ngModel);
          if(!e._id) return $scope.goBack();
          $scope.copy = angular.merge({objName: 'Sin Título'}, e);
          if($scope.lock) {
            $scope.lock({lock: false, id: $scope.ngModel._id})
            .then(function() {
              $scope.locked=false;
            });
          } else {
            $scope.locked = false;
          }
        };

        $scope.addInterface = function(iface) {
          if(!$scope.copy.objInterface) $scope.copy.objInterface = [];
          if(!$scope.copy.objInterface.includes(iface._id))$scope.copy.objInterface.push(iface._id);
        };

        $scope.removeInterface = function($event, iface) {
          $event.stopPropagation();
          var name = $scope.getName(iface);
          if(name && name.key) {
            delete $scope.copy[name.key];
          }
          if($scope.copy.objInterface && $scope.copy.objInterface.length && $scope.copy.objInterface.indexOf(iface) !== -1) {
            $scope.copy.objInterface.splice($scope.copy.objInterface.indexOf(iface), 1);
          }
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

        $scope.getGroups = function(ops) {
          var filter = {
            objName: {$regex: ops.searchText, $options: 'i'},
            objInterface: $scope.nMap.GroupInterface._id
          };
          return $q(function(resolve, reject) {
            $scope.$emit('docBuilder:search', filter, function(err, list) {
              if(err) return reject(err);
              if(ops.add) {
                for(var i in ops.add) {
                  if(new RegExp(ops.searchText, 'i').test(ops.add[i])) list.push({_id: i, objName: ops.add[i]});
                }
              }
              var filterList = [];
              if(ops.filter) {
                filterList = ops.filter.reduce(function(memo, key) {
                  var ids = $scope.security['_'+key].map(function(element) {
                    return element._id;
                  });
                  return memo.concat(ids);
                }, []);
              }
              resolve(list.filter(function(item) {
                return !filterList.includes(item._id);
              }));
            });
          });
        };

        $scope.getImplementableReserveWords = function() {
          return {any: 'Todos', system: 'Sistema', root: 'Administrador', iadmin: 'Administrador de Interfaces'};
        };

        $scope.editSecurity = function($event) {
          $scope.securityFlag = !$scope.securityFlag;
          if($scope.securityFlag) {
            $scope.metadataFlag = false;
            $scope.security = angular.merge({}, $scope.copy.objSecurity);
            $scope.security._owner=[];
            $scope.security._acl=[];
            if(!isEmpty($scope.security.owner)) {
              $scope.$emit('docBuilder:search', {_id: {$in: $scope.security.owner}}, function(err, list) {
                if(!err) $scope.security._owner = list;
              });
            }
            if(!isEmpty($scope.security.acl)) {
              if($scope.security.acl['group:public']) $scope.security._acl.push({_id: 'group:public', objName: 'Público', _acl: $scope.security.acl['group:public']});
              let ids = Object.keys($scope.security.acl).filter(function(k){
                return k!='group:public';
              });
              if(ids.length) $scope.$emit('docBuilder:search', {_id: {$in: ids}}, function(err, list) {
                if(!err) list.forEach(function(d) {
                  d._acl = $scope.security.acl[d._id];
                  $scope.security._acl.push(d);
                });
              });
            }
            if($scope.isSchema()) {
              var rw = $scope.getImplementableReserveWords();
              $scope.security._implementable=($scope.security.implementable||[]).filter(function(impId) {
                return !!rw[impId];
              }).map(function(impId) {
                return {_id: impId, objName: rw[impId]};
              });
              let ids = ($scope.security.implementable||[]).filter(function(k){
                return !rw[k];
              });
              if(ids.length) $scope.$emit('docBuilder:search', {_id: {$in: ids}}, function(err, list) {
                if(!err) list.forEach(function(d) {
                  $scope.security._implementable.push(d);
                });
              });
            }
          }
        };

        $scope.saveSecurity = function() {
          $scope.securityFlag = false;
          $scope.copy.objSecurity.owner = $scope.security._owner.map(function(owner) {
            return owner._id;
          });
          $scope.copy.objSecurity.inmutable = $scope.security.inmutable;
          $scope.copy.objSecurity.acl = {};
          $scope.security._acl.forEach(function(acl) {
            $scope.copy.objSecurity.acl[acl._id] = acl._acl;
          });
          if($scope.isSchema()) {
            $scope.copy.objSecurity.implementable = $scope.security._implementable.map(function(impl) {
              return impl._id;
            });
          }
        };

        $scope.selectInterface = function(iface) {
          if(!iface || $scope.copy.objInterface.indexOf(iface) === -1) return ($scope.selectedInterface = 0);
          $scope.selectedInterface = $scope.copy.objInterface.indexOf(iface);
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
          var replace = function(element) {
            switch (getType(element)) {
              case "object":
                for(var i in element) {
                  if(i == "docBuilder:iface:convert") {
                    return $scope.nMap[element[i]]._id;
                  } else {
                    element[i] = replace(element[i]);
                  }
                }
                break;
              case "array":
                element.forEach(function(e, i) {
                  element[i] = replace(e);
                });
            }
            return element;
          };
          filter = replace(filter);
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
          $scope.stack.push({copy: $scope.copy, selectedInterface: $scope.selectedInterface, selected: selected, locked: $scope.locked, model: model});
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
          $timeout(function() {
            $scope.$broadcast('docBuilder:activeSelect', level.selected);
          });
        });

        $scope.$on('docBuilder:leftInterface', function($event) {
          if($scope.selectedInterface > 0) $scope.selectedInterface--;
        });

        $scope.$on('docBuilder:rightInterface', function($event) {
          if($scope.selectedInterface < ($scope.copy.objInterface||[]).length) $scope.selectedInterface++;
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
        intNames: '=',
        isSchema: '<',
        active: '=',
        implementable: '=?'
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
            var down = function() {
              var parent;
              if(scope.selected.parent && ['array', 'object'].includes(getType(scope.selected.parent[scope.selected.key])) && !isEmpty(scope.selected.parent[scope.selected.key])) {
                let parent = scope.selected.parent[scope.selected.key];
                switch(getType(parent)) {
                  case "array":
                    scope.$emit('docBuilder:select', {parent: parent, key: 0, schema: scope.selectedSchema});
                    break;
                  case "object":
                    for(let i in parent) {
                      scope.$emit('docBuilder:select', {parent: parent, key: i, schema: scope.selectedSchema});
                      break;
                    }
                    break;

                }
              } else {
                let parent = scope.selected.root||scope.selected.parent;
                let key;
                if(getType(parent)=='array') {
                  key = angular.isDefined(scope.selected.key)?scope.selected.key+1:0;
                }
                if(getType(parent)=='object') {
                  var done = false;
                  for(let i in parent) {
                    if(i.substr(0,3)=='obj') continue;
                    if(!scope.selected.key || done)  {
                      key = i;
                      break;
                    }
                    if(scope.selected.key == i) done=true;
                  }
                }
                if(angular.isDefined(parent[key])) {
                  scope.$emit('docBuilder:select', {parent: parent, key: key, schema: scope.selected.schema||scope.schema});
                } else if(!scope.selected.root) {
                  scope.$broadcast('docBuilder:selectNextFrom', parent);
                }
              }
            };

            var up = function() {
              var parent = scope.selected.root||scope.selected.parent;
              var key;
              var schema;
              if(getType(parent)=='array') {
                key = angular.isDefined(scope.selected.key)?scope.selected.key-1:parent.length-1;
                schema = getType(scope.selected.schema.items)=='array'?scope.selected.schema.items[key]||{type: 'object'}:scope.selected.schema.items;
              }
              if(getType(scope.selected.parent)=='object') {
                for(var i in scope.selected.parent) {
                  if(i.substr(0,3)=='obj') continue;
                  if(scope.selected.key == i) break;
                  key = i;
                }
                schema = scope.selected.schema.properties[key];
              }
              if(scope.selected.parent && angular.isDefined(parent[key]) && ['array', 'object'].includes(getType(parent[key])) && !isEmpty(parent[key])) {
                switch(getType(parent[key])) {
                  case "array":
                    scope.$emit('docBuilder:select', {parent: parent[key], key: parent[key].length - 1, schema: schema});
                    break;
                  case "object":
                    var newKey;
                    for(let i in parent[key]) {
                      newKey = i;
                    }
                    scope.$emit('docBuilder:select', {parent: parent[key], key: newKey, schema: schema});
                    break;
                }
              } else {
                if(angular.isDefined(parent[key])) {
                  scope.$emit('docBuilder:select', {parent: parent, key: key, schema: scope.selected.schema||scope.schema});
                } else if(!scope.selected.root) {
                  scope.$broadcast('docBuilder:selectPrevFrom', parent);
                }
              }
            };

            element.on('keydown', function($event) {
              console.log($event.code +' '+ $event.which);

              console.log($event);
              if(angular.element($event.target).hasClass('label-input')) return;
              switch ($event.which) {
                case 13:
                case 40:
                  scope.$apply(down);
                  break;
                case 38:
                  scope.$apply(up);
                  break;
                case 27:
                  scope.$apply(scope.$emit('docBuilder:select'));
                  break;
                case 37:
                  if($event.ctrlKey) scope.$apply(scope.$emit('docBuilder:leftInterface'));
                  break;
                case 39:
                  if($event.ctrlKey) scope.$apply(scope.$emit('docBuilder:rightInterface'));
                  break;
              }

            });
          }
        };
      },
      controller: function($scope, $mdDialog, $mdToast, $filter, $document) {
        if(!$scope.ngModel) $scope.ngModel = {};
        $scope.$watch('ngModel', function(value) {
          if($scope.interface) {
            $scope.schema = angular.merge({}, $scope.interface);
            if(isEmpty(value)) $scope.ngModel = buildDocument($scope.schema);
          } else if(!$scope.interface || ((!$scope.interface.properties||isEmpty($scope.interface.properties)) && (!$scope.interface.items||isEmpty($scope.interface.items)))) {
            if(value.objSchema) {
              $scope.schema = {type: 'object', properties: value.objSchema};
            } else {
              $scope.schema = {type: 'object', properties: $filter('objFilter')(buildSchema(value).properties||{}, function(item, index, obj) {
                if(index=='_id'||index.match(/^obj/)||$scope.intNames.indexOf(index) !== -1) return false;
                return true;
              })};
              value.objSchema = $scope.schema.properties;
            }

          }
          if(!$scope.schema) $scope.schema = {type: 'object'};
          if(!$scope.selected||$scope.selected.root) $scope.$emit('docBuilder:select', null);
        });

        $scope.stopPropagation = function($event) {
          $event.stopPropagation();
        };

        $scope.$on('docBuilder:activeSelect', function($event, value) {
          if($scope.active) $scope.$emit('docBuilder:select', value);
        });
        $scope.$on('docBuilder:typeChange', function($event, type) {
          if($event.stopPropagation) $event.stopPropagation();
          $scope.selectedSchema.type = type;
          $scope.typeChange();
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
            value._key = value.key;
            var schema;
            switch(value.schema.type) {
              case "array":
                var type = getType(value.schema.items);
                schema = type=='array'?value.schema.items[value.key]:value.schema.items;
                break;
              case "object":
                schema = value.schema.properties[value.key];
            }
            if(schema.type == 'array') value.equalItems = getType(schema.items)!='array';
            if(schema.type == 'string') value._implements = schema.objImplements||[];
            value._doImplement = !!schema.objImplements;
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

        $scope.nameToString = function(item) {
          return item.objName;
        };

        $scope.changeEqualItems = function() {
          if($scope.selectedSchema.type == 'array') {
              if($scope.selected.equalItems && getType($scope.selectedSchema.items) == 'array') {
                var reduced = $scope.selectedSchema.items.reduce(function(memo, item, i) {
                  if(memo.one) {
                    if(!memo.one.type) {
                      memo.one = item;
                    } else if(!deepCompare(memo.one, item)) {
                      delete memo.one;
                    }
                  }
                  var tmpElem = {};
                  tmpElem['property_'+i] = item;
                  memo.many.properties = angular.merge(memo.many.properties, item.type=='object'?item.properties:tmpElem);
                  return memo;
                }, {one: {}, many: {type: 'object', properties: {}}});
                $scope.selectedSchema.items = reduced.one||reduced.many;
                $scope.selected.parent[$scope.selected.key].forEach(function(item, i, parent) {
                  parent[i] = buildDocument($scope.selectedSchema.items);
                });
                if($scope.isSchema && $scope.selected.parent[$scope.selected.key].length > 1) {
                  $scope.selected.parent[$scope.selected.key].splice(1, $scope.selected.parent[$scope.selected.key].length);
                }
              } else if(!$scope.selected.equalItems && getType($scope.selectedSchema.items) == 'object'){
                $scope.selectedSchema.items = $scope.selected.parent[$scope.selected.key].map(function(item) {
                  return $scope.selectedSchema.items;
                });
              }
          }
        };

        $scope.testVal = function() {
          return /^(\S{12}||\w{24})$/.test($scope.selected.parent[$scope.selected.key]);
        };

        $scope.implementInterface = function(iface) {
          $scope.selectedSchema.objImplements = $scope.selectedSchema.objImplements||[];
          if(!$scope.selectedSchema.objImplements.includes(iface)) $scope.selectedSchema.objImplements.push(iface);
        };

        $scope.docSearch = function() {
          if(!$scope.docSearchText.length) return ($scope.searchDocumentList=[]);
          var filter = {
            objName: {$regex: $scope.docSearchText, $options: 'i'}
          };
          if($scope.selectedSchema.objImplements) {
            var oi = $scope.selectedSchema.objImplements;
            switch(getType(oi)) {
              case "string":
                filter.objInterface = {'docBuilder:iface:convert': oi};
                break;
              case "array":
                filter.objInterface = {$in: oi.map(function(imp) {
                  return {'docBuilder:iface:convert': imp};
                })};
                break;
              case "object":
                if(oi.name) filter.objInterface = {'docBuilder:iface:convert': oi.name};
                else if(oi.any) filter.objInterface = {$in: oi.any.map(function(imp) {
                  return {'docBuilder:iface:convert': imp};
                })};
                else if(oi.all) filter.objInterface = {$elemMatch: oi.all.map(function(imp) {
                  return {$in: [{'docBuilder:iface:convert': imp}]};
                })};
                break;
            }
          }
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
        };

        $scope.editDocument = function() {
          $scope.$emit('docBuilder:getDocument', $scope.selected.parent[$scope.selected.key], function(err, doc) {
            if(err || !doc) {
              return $mdToast.showSimple('No se puede encontrar documento con id '+$scope.selected.parent[$scope.selected.key]);
            }

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

        $scope.doAction = function($event) {
          $event.stopPropagation();
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
              if(Object.keys(element).includes($scope.selected.new)) {
                $mdToast.showSimple($scope.selected.new+' ya fue definido.');
                return delete $scope.selected.new;
              }
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
            return ($scope.selected.parent[$scope.selected.key] = $scope.memo.value);
          }
          var val = $scope.selected.parent[$scope.selected.key];
          switch(schema.type) {
            case "object":
              $scope.selected.parent[$scope.selected.key] = {};
              break;
            case "array":
              $scope.selected.parent[$scope.selected.key] = [];
              break;
            case "number":
              if(Number(parseFloat(val))!=val) $scope.selected.parent[$scope.selected.key] = null;
              else $scope.selected.parent[$scope.selected.key] = parseFloat(val);
              break;
            case "date":
              if(/[0-9]{4}-[09]{2}-[0-9]{2}/.test(val) && !isNaN(new Date(val).getTime())) $scope.selected.parent[$scope.selected.key] = null;
              break;
            case "boolean":
              $scope.selected.parent[$scope.selected.key] = !!$scope.selected.parent[$scope.selected.key];
              break;
            case "string":
              if(typeof val == 'object') $scope.selected.parent[$scope.selected.key] = null;
          }
        };

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
        types: "<",
        isSchema: '<',
        edit: '<?',
        editSchema: '<?'
      },
      controller: function($scope, $filter) {
        $scope.getType = getType;
        $scope.isEmpty = isEmpty;

        $scope.$on('docBuilder:selectNextFrom', function($event, fromItem) {
          var next = false;
          for(let i in $scope.iteration) {
            let item = $scope.iteration[i];
            if(next) return $scope.select($event, item, false);
            if(item.item === fromItem) next=true;
          }
        });

        $scope.$on('docBuilder:selectPrevFrom', function($event, fromItem) {
          for(let i in $scope.iteration) {
            let item = $scope.iteration[i];
            if(item.item === fromItem) return $scope.select($event, item, false);
          }
        });

        $scope.select = function($event, item, dblck) {
          $event.stopPropagation&&$event.stopPropagation();
          if(item.key != $scope.selected.key) {
            if($scope.selected.item) $scope.clearItem(null, $scope.selected.item);
            var element = {parent: $scope.ngModel, key: item.key, schema: $scope.schema, item: item};
            if(!dblck && $scope.selected.parent == element.parent && $scope.selected.key == element.key) {
              element = null;//{parent: null, key: null, schema: null};
            }
            $scope.$emit('docBuilder:select', element, dblck);
          }

        };

        $scope.clearItem = function($event, item) {
          if($event) $event.stopPropagation();
          item._item = item.item;
          item._type = item.schema.type;
          item._key = item.key;
          item.editSchema = false;
          item.editLabel = false;
        };

        $scope.changeType = function(type) {
          $scope.$emit('docBuilder:typeChange', type);
        };


        $scope.changeLabel = function(item) {
          item.editLabel = false;
          if($scope.selected.key == item._key) return;
          $scope.selected.parent[item._key] = $scope.selected.parent[item.key];
          delete $scope.selected.parent[item.key];
          $scope.selected.schema.properties[item._key] = $scope.selected.schema.properties[item.key];
          delete $scope.selected.schema.properties[item.key];
          $scope.selected.key = item._key;
        };

        $scope.changeValue = function($event, item) {
          if($scope.selected.key != item.key) return;
          $scope.selected.parent[$scope.selected.key] = item._item;
          if($scope.selected.key != item._key) $scope.changeLabel(item);
          if(item.schema.type != item._type) $scope.changeType(item._type);
          $scope.clearItem(null, item);
        };

        $scope.openMenu = function($event, key, $mdOpenMenu) {
          if(!$scope.editSchema) return;
          if($scope.selected.key == key) $event.stopPropagation();
          $mdOpenMenu();
        };

        $scope.editLabel = function($event, item) {
          if(!$scope.editSchema) return;
          if($scope.selected.key == item.key) $event.stopPropagation();
          item.editLabel = true;
        };

        $scope.editValue = function($event, item) {
          if(!$scope.edit) return;
          if($scope.selected.key == item.key) $event.stopPropagation();
          else $scope.select($event, item);
          /*item._item = item.item;
          item._type = item.schema.type;
          item._key = item.key;*/
          item.edit = true;
        };

        $scope.delete = function() {
          if(getType($scope.selected.parent)=='array') {
            $scope.selected.parent.splice($scope.selected.key,1);
          } else {
            delete $scope.selected.parent[$scope.selected.key];
          }
          $scope.$emit('docBuilder:select', null, false);
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
                it._item = it.item;
                it._type = it.schema.type;
                it._key = it.key;
                it.edit = false;
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
                  it._item = it.item;
                  it._type = it.schema.type;
                  it._key = it.key;
                  it.edit = false;
                  $scope.iteration.push(it);
                })(i, $scope.ngModel[i]);
              }
              break;
          }
        };

        $scope.$watchCollection('ngModel', function(value, prev) {
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
  })
  .directive('docBuilderIfaceSelector', function() {
    return {
      restrict: 'E',
      template: interfaceDialogTemplate,
      scope: {
        interfaces:'=',
        select: '&'
      }
    };
  })
  .directive('focusMe', function($timeout) {
    return {
      scope: { trigger: '<focusMe' },
      link: function(scope, element) {
        scope.$watch('trigger', function(value) {
          if(value === true) {
            element[0].focus();
            scope.trigger = false;
          }
        });
      }
    };
  })
  .directive('tabRemove', function() {
    return {
      restrict: 'E',
      template: '<md-icon md-font-set="material-icons">delete</md-icon>'
    }
  });
})();
