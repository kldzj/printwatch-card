import { html } from "lit";
import { formatDuration } from "../../utils/formatters";
import { localize } from "../../utils/localize";

export const headerTemplate = (entities, controls, config = {}) => html`
  <div class="header">
    <div>
      <div class="printer-name">${entities.name}</div>
      <div class="status">
        ${localize.localize(`entity.sensor.state.${entities.status}`)}
        ${entities.isPrinting
          ? html`
              <span class="progress-text">
                ${Math.round(entities.progress)}% |
                ${localize.t("print.layer")}:
                ${entities.currentLayer}/${entities.totalLayers}
              </span>
            `
          : ""}
      </div>
      ${entities.isPrinting
        ? html`
            <div class="progress-bar">
              <div
                class="progress-fill"
                style="width: ${entities.progress}%"
              ></div>
            </div>
            <div class="layer-info">
              ${localize.t("time.left")}:
              ${formatDuration(entities.remainingTime, {
                unit_of_measurement: config.time_unit_of_measurement || "hour",
                showSeconds: config.show_seconds || false,
              })}
            </div>
          `
        : ""}
    </div>
    <div class="header-controls">
      <button
        class="icon-button ${controls.lightState === "on" ? "active" : ""}"
        @click=${controls.onLightToggle}
      >
        <ha-icon icon="mdi:lightbulb"></ha-icon>
      </button>
      ${entities.aux_fan_entity
        ? html`
            <button
              class="icon-button ${controls.fanState === "on" ? "active" : ""}"
              @click=${controls.onFanToggle}
            >
              <ha-icon icon="mdi:fan"></ha-icon>
            </button>
          `
        : ""}
    </div>
  </div>
`;
