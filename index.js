const { Plugin } = require('powercord/entities');
const { getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { sleep, waitFor } = require('powercord/util');

module.exports = class PendingDefault extends Plugin {
  startPlugin() {
    // Use injectId to not repeat
    this.injectId = 'pendingDefault';

    // Keep track of one shot
    this.hasChangedSelected = false;

    this.patchTabBar();
  }

  async patchTabBar() {
    const TabBar = getModuleByDisplayName('TabBar', false);

    inject(this.injectId, TabBar.prototype, 'render', (_, res) => {
      // Only select once
      if (this.hasChangedSelected) return res;
      this.hasChangedSelected = true;

      (async () => {
        // Wait for selected online element
        await waitFor(`.tabBar-ZmDY9v.topPill-30KHOu > .item-3HknzM.selected-3s45Ha[data-item-id="ONLINE"]`);

        // Select pending instead
        res._owner.memoizedProps.onItemSelect('PENDING');
      })();

      return res;
    });

    // (Is this needed for getModuleByDisplayName?)
    TabBar.displayName = 'TabBar';
  }

  pluginWillUnload() {
    uninject(this.injectId);
  }
}