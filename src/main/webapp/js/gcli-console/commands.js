var CommandsRegistry = {

	checkDocument : {
		name : 'checkDocument',
		description : 'verifies that the document is semantically correct. You must specify the file path',
		params : [ {
			name : 'uri',
			type : 'string',
			description : "Document path. You must specify the file path as shown below:\n"
					+ " [nameProject]/[nameFolder]/.../[nameDocument.extension].",
		} ],
		returnType : "string",
		exec : function(args, context) {
			var deferred = context.defer();

			var uri = WorkspaceManager.getSelectedWorkspace() + "/" + args.uri;
			auxCheckDocument(uri, function(result) {
				deferred.resolve(result);
			});

			return deferred.promise;
		}
	},

	checkCurrentDocument : {
		name : 'checkCurrentDocument',
		description : 'verifies that the  current document in editor is semantically correct.',
		returnType : "string",
		exec : function(args, context) {
			var deferred = context.defer();

			var uri = EditorManager.getCurrentUri();
			console.log(uri);
			auxCheckDocument(uri, function(result) {
				deferred.resolve(result);
			});

			return deferred.promise;
		}
	},

	openFile : {
		name : 'openFile',
		description : 'Open a document from your workspace. You must specify the document path.',
		params : [ {
			name : 'uri',
			type : 'string',
			description : "Document path. You must specify the file path as shown below:\n"
					+ " [nameProject]/[nameFolder]/.../[nameDocument.extension].",
		} ],
		exec : function(args, context) {
			var deferred = context.defer();

			var uri = WorkspaceManager.getSelectedWorkspace() + "/" + args.uri;
			auxOpenFile(uri, function(result) {
				deferred.resolve(result);
			});
		}
	},

	closeFile : {
		name : 'closeFile',
		description : 'Close a document that is open in your editor. You must specify the document path in the workspace.',
		params : [ {
			name : 'uri',
			type : 'string',
			description : "Document path. You must specify the file path as shown below:\n"
					+ " [nameProject]/[nameFolder]/.../[nameDocument.extension].",
		} ],
		exec : function(args, context) {
			var deferred = context.defer();

			var uri = WorkspaceManager.getSelectedWorkspace() + "/" + args.uri;
			auxCloseFile(uri, function(result) {
				deferred.resolve(result);
			});
		}
	},

	deleteNode : {
		name : 'deleteNode',
		description : 'Delete a document from your workspace. You must specify the document path.',
		params : [ {
			name : 'uri',
			type : 'string',
			description : "Document path. You must specify the node path as shown below:\n"
					+ " [nameProject]/[nameFolder]/.../[nameDocument.extension].",
		} ],
		exec : function(args, context) {
			var deferred = context.defer();

			var uri = WorkspaceManager.getSelectedWorkspace() + "/" + args.uri;
			auxDeleteNode(uri, function(result) {
				deferred.resolve(result);
			});
		}
	},

	renameNode : {
		name : 'renameNode',
		description : 'Rename a document from your workspace. You must specify the document path.',
		params : [
				{
					name : 'uri',
					type : 'string',
					description : "Document path. You must specify the node path as shown below:\n"
							+ " [nameProject]/[nameFolder]/.../[nameDocument.extension].",
				},
				{
					name : "newName",
					type : "string",
					description : "New name for specified document. You must specify the name as shown below: [name].[extension]"
				} ],
		exec : function(args, context) {
			var splitUri = args.uri.split("/");
			var wasAFile = (splitUri[splitUri.length - 1]).split(".").length == 2;
			var nameParts = args.newName.split(".");
			if (nameParts.length != 2 && wasAFile) {
				CommandApi
						.echo("Please, inserte a name specifying his extension. "
								+ "\nex: [nameProject]/[nameDocument.extension]");
			} else {
				var deferred = context.defer();
				var uri = WorkspaceManager.getSelectedWorkspace() + "/"
						+ args.uri;
				var newName = args.newName;
				auxRenameNode(uri, newName, function(result) {
					deferred.resolve(result);
				});
			}
		}
	},

	move : {
		name : 'moveNode',
		description : 'Moves a workspace tree node to another position on said tree. You must specify both path.',
		params : [
				{
					name : 'origin',
					type : 'string',
					description : "Old node path. You must specify the node path as shown below:\n"
							+ " [nameProject]/[nameFolder]/.../[nameDocument.extension].",
				},
				{
					name : "destination",
					type : "string",
					description : "New node path. You must specify the node path as shown below:\n"
							+ " [nameProject]/[nameFolder]/.../[nameDocument.extension]."
				} ],
		exec : function(args, context) {
			var deferred = context.defer();

			var origin = WorkspaceManager.getSelectedWorkspace() + "/"
					+ args.origin;
			var destination = WorkspaceManager.getSelectedWorkspace() + "/"
					+ args.destination;

			auxMoveNode(origin, destination, function(result) {
				deferred.resolve(result);
			});
		}
	},

	copy : {
		name : 'copyNode',
		description : 'Copy a workspace tree node to another position on said tree. You must specify both path.',
		params : [
				{
					name : 'origin',
					type : 'string',
					description : "Actual node path. You must specify the node path as shown below:\n"
							+ " [nameProject]/[nameFolder]/.../[nameDocument.extension].",
				},
				{
					name : "destination",
					type : "string",
					description : "Destination copy node path. You must specify the node path as shown below:\n"
							+ " [nameProject]/[nameFolder]/.../[nameDocument.extension]."
				} ],
		exec : function(args, context) {
			var deferred = context.defer();

			var origin = WorkspaceManager.getSelectedWorkspace() + "/"
					+ args.origin;
			var destination = WorkspaceManager.getSelectedWorkspace() + "/"
					+ args.destination;

			auxCopyNode(origin, destination, function(result) {
				deferred.resolve(result);
			});
		}
	},

	generateDemoWorkspace : {
		name : 'generateDemoWorkspace',
		description : 'Generate a workspace for a specific Demo.',
		params : [ {
			name : 'demoName',
			type : 'string',
			description : 'Identifies the Demo workspace',
		} ],
		exec : function(args, context) {

			var deferred = context.defer();
			auxGenerateDemo(args.demoName, args.demoName);
			deferred.resolve("");

		}
	},

	generateDemoWorkspaceWithDestination : {
		name : 'generateDemoWorkspaceWithDestination',
		description : 'Generate a workspace for a specific Demo, allowing to define the destination workspace name.',
		params : [
				{
					name : 'demoName',
					type : 'string',
					description : 'Identifies the Demo workspace',
				},
				{
					name : "destinationWorkspaceName",
					type : "string",
					description : "Optionally choose a name for the workspace. If not specified the default demo name will be used."
				} ],
		exec : function(args, context) {

			var deferred = context.defer();
			auxGenerateDemo(args.demoName, args.destinationWorkspaceName);
			deferred.resolve("");

		}
	},

	echo : {
		name : 'echo',
		description : 'Show a message',
		params : [ {
			name : 'message',
			type : 'string',
			description : 'The message to output, can be in plain text or HTML',
		} ],
		returnType : 'string',
		exec : function(args, context) {
			$("#gcli-root .gcli-in-top").last().before(
					"<div class=\"gcli-row-out\" aria-live=\"assertive\"><div>"
							+ args.message + "</div></div>");
			var display = $("#gcli-root .gcli-display");
			display.scrollTop(display.prop("scrollHeight"));
			return "";
		}
	},

	deleteCurrentWorkspace : {
		name : 'deleteCurrentWorkspace',
		description : 'Delete the current workspace',
		exec : function(args, context) {
			var deferred = context.defer();
			var uri = WorkspaceManager.getSelectedWorkspace();
			auxDeleteWorkspace(uri);
		}
	},

	deleteWorkspace : {
		name : 'deleteWorkspace',
		description : 'Delete a workspace. You must specify the document path.',
		params : [ {
			name : 'nameWS',
			type : 'string',
			description : "Workspace path. You must specify the WS path as shown below:\n"
					+ " [nameWorkspace]",
		} ],
		exec : function(args, context) {
			var deferred = context.defer();
			var uri = args.nameWS;
			auxDeleteWorkspace(uri);
		}
	},

	testModule : {
		name : 'testModule',
		description : 'Test a language module. You must specify the module id to test.',
		params : [ {
			name : 'moduleID',
			type : 'string',
			description : "Language module id.",
		} ],
		exec : function(args, context) {
			var module = args.moduleID;
			CommandApi.echo("Testing module: " + module);
			auxTestModule(module);

		}
	},
	
	convertCurrentWorkspacetoDemo : {
		name : 'convertCurrentWorkspacetoDemo',
		description : 'Convert actual workspace in a demo workspace.',
		exec : function(args, context) {
			CommandApi.echo("Converting WS...");
			console.log(WorkspaceManager.getSelectedWorkspace());
			
			FileApi.currnetWSAsDemoWS(WorkspaceManager.getSelectedWorkspace(),function(){});
		}
	},
	
	clearConsole : {
		name : 'clear',
		description : 'Clear console.',
		exec : function(args, context) {
			CommandApi.echo("Clearing ...");
			$('div.gcli-display div.gcli-row-in').remove();
			$('div.gcli-display div.gcli-row-out').remove();
			CommandApi.echo("console was cleared");
		}
	}

};

// Auxiliary functions:

var auxCheckDocument = function(fileUri, callback) {
	mayCheckLanguageSyntax(fileUri);
	if (checkSyntaxFlag) {
		callback("Syntax OK");
	} else {
		callback("Ups! was problems in syntax");
	}
};

var auxOpenFile = function(fileUri, callback) {
	console.log("openFile uri: " + fileUri);
	CommandApi.openFile(fileUri, function() {
		CommandApi.echo("The document was open.");
	});

};

var auxCloseFile = function(fileUri, callback) {
	console.log("openFile uri: " + fileUri);
	CommandApi.closeFile(fileUri);
};

var auxDeleteNode = function(fileUri, callback) {
	CommandApi.deleteNode(fileUri, function(ts) {
		if (ts == "OK" || ts == "true") {
			callback("The node was deleted correctly.");
		} else {
			callback("The node has problems:\n" + ts);
		}
	});
};

var auxRenameNode = function(uri, newName, callback) {
	CommandApi.renameNode(uri, newName, function(ts) {
		// if (ts == true || ts == "true") {
		// callback("The node was renamed correctly.");
		// } else {
		// callback("The node has problems:\n" + ts);
		// }
	});
};

var auxMoveNode = function(origin, destination) {
	CommandApi.move(origin, destination);
};

var auxCopyNode = function(origin, destination) {
	CommandApi.copy(origin, destination);
};

var auxGenerateDemo = function(demoName, destinationWorkspaceName) {
	if (destinationWorkspaceName == undefined
			|| destinationWorkspaceName == null)
		destinationWorkspaceName = demoName;
	CommandApi.importDemoWorkspace(demoName, destinationWorkspaceName);
};

var auxDeleteWorkspace = function(fileUri) {
	WorkspaceManager.deleteWorkspace(fileUri, function(ts) {
		if (ts) {
			CommandApi.echo("The workspace was deleted correctly.");
		} else {
			CommandApi.echo("There was a problem while deleting the workspace");
		}
	});
};

var auxTestModule = function(module) {

	operations = ModeManager.getOperations(module);

	$.getJSON("/ideas-" + module + "/tests/tests.json").done(
			function(response) {
				var _continue = true;
				for (var i = 0; i < response.length; i++) {
					if(_continue){
						var json = response[i];
						var opId = json.id;
						var opUri = "/ideas-" + module + json.opUri;
						var opMethod = json.opMethod;
						var parameters = json.parameters;
						var resultList = json.results;
	
						jQuery.ajaxSetup({
							async : false
						});
						$.get("/ideas-" + module + parameters.fileUri, function(
								content) {
	
							if (opMethod == "GET") {
								$.get(opUri, function(data) {
									// TODO
								});
							} else if (opMethod == "POST") {
								parameters.content = content;
								if (parameters.auxArg0 == undefined) {
									$.post(opUri, parameters, function(new_result) {
										for(var k=0; k<resultList.length;k++){
											result = eval(resultList[k]);
											if (JSON.stringify(result) === JSON
													.stringify(new_result)) {
												CommandApi.echo("- Operation " + opId
														+ ": OK");
												_continue = true;
												break;
											} else {
												_continue = false;
											}
										}
										
										if(!_continue){
											CommandApi.echo("- Operation " + opId
													+ ": FAIL");
											CommandApi.echo(new_result.message);
										}
										
									});
								} else {
									$.get("/ideas-" + module + parameters.auxArg0, function(data) {
										parameters.auxArg0 = data;
										$.post(opUri, parameters, function(new_result) {
											for(var k=0; k<resultList.length;k++){
												result = eval(resultList[k]);
												if (JSON.stringify(result) === JSON
														.stringify(new_result)) {
													CommandApi.echo("- Operation " + opId
															+ ": OK");
													_continue = true;
													break;
												} else {
													_continue = false;
												}
											}
											
											if(!_continue){
												CommandApi.echo("- Operation " + opId
														+ ": FAIL");
												CommandApi.echo(new_result.message);
											}
										});
									});
								}
							}
						});
					}
				}
			}).fail(function(jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		console.log("Request Failed: " + err);
	});

	jQuery.ajaxSetup({
		async : true
	});

	// CommandApi.doDocumentOperation(module, data, fileUri, callback, async)
};
