'use strict';




app.directive('dynamicInput', ['$compile', 'AppUserFieldsData',
    function($compile, AppUserFieldsData) {

        var textbox = '<input type="text" name="{{field.name}}" id="dyn-input" placeholder="{{field.name}}">';
    
        var radio = '<label class="toggle toggle-assertive">'+
                       '<input type="checkbox" name="{{field.name}}" id="dyn-input"  name="{{field.name}}">'+
                       '<div class="track">'+
                            '<div class="handle"></div>'+
                       '</div>'+
                    '</label>';
        var checkbox = radio;
        
        var textarea = textbox;


        function renderSelect(field){

            var template = '<select id="dyn-input">';
            var options = field.options.split(" ");

            for(var i = 0; i < options.length; i++){

                template += '<option>'+options[i]+'</option>';

            }

            template += '</select>';

            return template;
        }

        function getTypeRender(field){

            var template = '';

            switch(field.type){

                case 'textbox':
                    template = textbox;
                break;

                case 'select':
                    template = renderSelect(field);
                break;

                case 'checkbox':
                    template = checkbox;
                break;

                case 'radio':
                    template = radio;
                break

                case 'textarea':
                    template = textarea;
                break;
            }

            return template;
        }

        function getValue(field, user, input){

            input.attr('disabled','disabled');

           AppUserFieldsData.get({user: user, field : field.id}).then(function(res) {

                input.removeAttr('disabled');
                
                if(!res.data)
                    return;

                if(field.type == "checkbox" && res.data.value == "1")
                    input.attr("checked","checked");

                if(field.type == "textbox" || field.type == "select" || field.type == "textarea")
                    input[0].value =  res.data.value;
            });
        }

        function handleChange(field, input){
            if(field.type == 'checkbox' || field.type == 'radio')
                return (input.checked)? 1 : 0;

            return (input.value);
        }

        return {
            restrict: 'AE',
            scope: {
                field: '=field',
                user: '=user',
                dowork : '&',
            },
            //template: '<input type="text" name="{{field.name}}" placeholder="{{field.name}}">',//getTypeRender(field.type),
            link: function(scope, element, attrs) {
                //console.log(scope.field.type);

                var template = getTypeRender(scope.field);
                element.html(template);

                var input = angular.element( element[0].querySelector('#dyn-input') );

                getValue(scope.field, scope.user, input);

                input.bind('change', function (e) {

                    var doData = handleChange(scope.field,input[0]);
                    
                    scope.dowork({
                        param : {field: scope.field.id, value: doData}
                    });
                   
                });

                $compile(element.contents())(scope);
            }
        };
    }
]);