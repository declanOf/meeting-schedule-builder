/**
 * TODO:
 * Create initialisation process if there's no configuration.
 * This will require removing auto-create from configuration,
 * but not necessarily the functionality to create.
 *
 * Most likely, we'll create a configuration manager that can
 * auto-build from a selection. It will be called be a dialog
 * that first presents initialisation options such as choosing
 * from a pre-selected configuration or building one anew.
 */

class Installer
{
    constructor() {
        new InstallDialog();
    }
}