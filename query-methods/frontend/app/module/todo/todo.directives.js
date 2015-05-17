'use strict';

angular.module('app.todo.directives', [])
    .controller('DeleteTodoController', ['$scope', '$modalInstance', '$state', 'TodoService', 'todoEntry', 'successCallback', 'errorCallback',
        function($scope, $modalInstance, $state, TodoService, todoEntry, successCallback, errorCallback) {
            console.log('Showing delete confirmation dialog for todo entry: ', todoEntry);
            $scope.todoEntry = todoEntry;

            $scope.cancel = function() {
                console.log('User clicked cancel button. Todo entry is not deleted.');
                $modalInstance.dismiss('cancel');
            };

            $scope.delete = function() {
                console.log('User clicked delete button. Todo entry is deleted.');
                $modalInstance.close();
                TodoService.delete(todoEntry, successCallback, errorCallback);
            };
        }])
    .directive('deleteTodoEntryButton', ['$modal', '$state', 'NotificationService', function($modal, $state, NotificationService) {
        return {
            link: function (scope, element, attr) {
                scope.onSuccess = function() {
                    NotificationService.flashMessage('todo.notifications.delete.success', 'success');
                    $state.go('todo.list');
                };

                scope.onError = function() {
                    NotificationService.flashMessage('todo.notifications.delete.error', 'error');
                };

                scope.showDeleteConfirmationDialog = function() {
                    $modal.open({
                        templateUrl: 'todo/delete-todo-modal.html',
                        controller: 'DeleteTodoController',
                        resolve: {
                            errorCallback: function() {
                                return scope.onError;
                            },
                            successCallback: function() {
                                return scope.onSuccess;
                            },
                            todoEntry: function () {
                                return scope.todoEntry;
                            }
                        }
                    });
                };
            },
            template: '<a class="btn btn-danger" ng-click="showDeleteConfirmationDialog()" translate="pages.delete.link"></a>',
            scope: {
                todoEntry: '='
            }
        };
    }])
    .directive('todoEntryForm', ['$state', 'NotificationService', 'TodoService', function($state, NotificationService, TodoService) {
        return {
            link: function (scope, element, attr) {
                scope.saveTodoEntry = function() {
                    console.log('Saving todo entry: ', scope.todoEntry);

                    var onSuccess = function(saved) {
                        NotificationService.flashMessage(scope.successMessageKey, 'success');
                        $state.go('todo.view', {id: saved.id});
                    };

                    var onError = function() {
                        NotificationService.flashMessage(scope.errorMessageKey, 'errors');
                    };

                    if (scope.formType === 'add') {
                        TodoService.add(scope.todoEntry, onSuccess, onError);
                    }
                    else if (scope.formType === 'edit') {
                        TodoService.update(scope.todoEntry, onSuccess, onError);
                    }
                    else {
                        console.log('Unknown form type: ', scope.formType);
                    }
                };
            },
            templateUrl: 'todo/todo-form-directive.html',
            scope: {
                errorMessageKey: '@',
                formType: '@',
                todoEntry: '=',
                successMessageKey: '@'
            }
        };
    }])
    .directive('todoEntryList', [function() {
        return {
            templateUrl: 'todo/todo-list-directive.html',
            scope: {
                todoEntries: '='
            }
        };
    }]);