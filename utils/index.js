export function generateQueryString(params) {
  const isEmpty = Object.values(params).every((value) => value === "");

  if (isEmpty) {
    return "";
  }

  const queryString = Object.entries(params)
    .filter(
      ([_key, value]) => value !== "" && value !== null && value !== undefined,
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return `?${queryString}`;
}

export function sanitizeParams(params) {
  const sanitizedObj = {};

  for (const key in params) {
    if (params[key]) {
      sanitizedObj[key] = params[key];
    }
  }

  return sanitizedObj;
}

export function transformCategories(data) {
  if (data?.length === 0) {
    return [];
  }

  return data.map((category) => {
    // Create a copy of the category object
    const transformedCategory = { ...category };

    // Add new field 'key' with the same value as 'id'
    transformedCategory.key = category.id;

    // Rename 'sub_categories' to 'children' if they exist
    if (
      Array.isArray(category.sub_categories) &&
      category.sub_categories.length > 0
    ) {
      transformedCategory.children = transformCategories(
        category.sub_categories,
      );
    }

    // Remove the original 'sub_categories' property
    delete transformedCategory.sub_categories;

    return transformedCategory;
  });
}

export const formatText = (text) => {
  if (text) {
    const textLowerCase = text.split("_").join(" ").toLowerCase();
    const formattedText =
      textLowerCase.charAt(0).toUpperCase() + textLowerCase.slice(1);
    return formattedText;
  } else {
    return "";
  }
};
