function Component() {
  Component.prototype.createOperations = function() {
    // call default implementation
    component.createOperations();

    // ... add custom operations

    var kernel = systemInfo.kernelType;

    if (kernel == "winnt") {
      component.addOperation("CreateShortcut", "@TargetDir@/pat/ParametricAnalysisTool.exe", "@StartMenuDir@/Parametric Analysis Tool.lnk");
    } else if (kernel == "darwin") {
      var exePath = installer.value("TargetDir") + "/bin/install_utility";
      component.addElevatedOperation("Execute", "chmod", "-R", "a+w", "@TargetDir@/ParametricAnalysisTool.app/Contents/Resources/OpenStudio-server");
    } else if (kernel == "linux") {
      component.addElevatedOperation("Execute", "mkdir", "@TargetDir@/opt/Resources/OpenStudio-server/server/tmp");
      component.addElevatedOperation("Execute", "chmod", "-R", "777", "@TargetDir@/opt/Resources/OpenStudio-server/server/tmp");
    }
  }
}
