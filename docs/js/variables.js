document.addEventListener("DOMContentLoaded", () => {
  const variableRegex = /\{\{(\w+)(?::([^}]+))?\}\}/g;
  const contentContainer = document.querySelector(".md-content");

  if (!contentContainer) {
    console.error("No .md-content container found.");
    return;
  }

  const variables = {};
  let updatedContent = contentContainer.innerHTML.replace(
    variableRegex,
    (match, varName, options) => {
      const opts = options ? options.split(",") : [];
      const defaultValue = opts[0] || "";

      if (!variables[varName]) {
        variables[varName] = { defaultValue, options: opts, elements: [] };
      }

      const placeholder = `<span class="variable" data-var-name="${varName}">${defaultValue}</span>`;
      variables[varName].elements.push(placeholder);
      return placeholder;
    }
  );

  contentContainer.innerHTML = updatedContent;

  // Only create the form if there are variables
  if (Object.keys(variables).length > 0) {
    const form = document.createElement("form");
    form.setAttribute("class", "variable-form");
    form.innerHTML = "<h3>Configure mandatory variables</h3><p>This page is interative, you can configure here the important variable.</p>";

    Object.entries(variables).forEach(([name, { defaultValue, options }]) => {
      const label = document.createElement("label");
      const formattedName = name
        .replace(/_/g, " ")
        .replace(/^(\w)/, (match) => match.toUpperCase());
      label.innerHTML = `${formattedName}: `;

      let input;
      if (options.length > 1) {
        // Create a select field
        input = document.createElement("select");
        options.forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option;
          opt.textContent = option;
          if (option === defaultValue) {
            opt.selected = true;
          }
          input.appendChild(opt);
        });
      } else {
        // Create a text field
        input = document.createElement("input");
        input.type = "text";
        input.value = defaultValue;
      }

      input.setAttribute("data-var-name", name);
      label.appendChild(input);
      form.appendChild(label);
      form.appendChild(document.createElement("br"));
    });

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.textContent = "Update Configuration";
    form.appendChild(submitButton);

    // Insert the form at the beginning of the .md-content container
    contentContainer.insertAdjacentElement("afterbegin", form);

    // Update content on form submission
    submitButton.addEventListener("click", () => {
      const inputs = form.querySelectorAll("input, select");
      inputs.forEach((input) => {
        const varName = input.getAttribute("data-var-name");
        const value = input.value.trim();

        const elementsToUpdate = document.querySelectorAll(
          `span[data-var-name="${varName}"]`
        );
        elementsToUpdate.forEach((el) => {
          el.textContent = value;
        });
      });
    });
  }
});
