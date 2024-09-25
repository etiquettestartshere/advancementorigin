class FeatureOrigin {

  static init() {
    Hooks.on("renderItemSheet5e", FeatureOrigin._advancementOrigin);
  }

  static _advancementOrigin(app, [html]) {
    const actor = app.actor;
    if (!actor) return;
    if (app.object.type !== "feat" || app.object?.getFlag("dnd5e", "advancementOrigin")?.includes(".")) return;
    const current = app.object?.getFlag("dnd5e", "advancementOrigin");
    const choices = actor.items.reduce((acc, i) => {
      if (!i.system.advancement) return acc;
      acc.push({
        value: i.id,
        label: app.object.parent.items.get(i.id).name,
        group: game.i18n.localize(`TYPES.Item.${i.type}`)
      });
      return acc;
    }, []).sort((a, b) => a.group.localeCompare(b.group));
    const origins = HandlebarsHelpers.selectOptions(choices, { hash: { selected: current, sort: true } });
    const origin = `
      <div class="form-group">
        <label>${game.i18n.localize("FEATUREORIGIN.Label")}</label>
        <div class="form-fields">
          <select name="flags.dnd5e.advancementOrigin">
            <option></option>
            ${origins}
          </select>
        </div>
      </div>
    `;
    const type = html.querySelector('.form-group:has(select[name="system.type.subtype"])') ??
      html.querySelector('.form-group:has(select[name="system.type.value"])');
    type.insertAdjacentHTML("afterend", origin);
  }
}

Hooks.once("init", FeatureOrigin.init);