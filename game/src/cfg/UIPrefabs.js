export const UIPrefabs = {
    Text: {
        name: "UI_Text",
        components: [
            {
                type: "UI", config: ({overrides}) => ({layer: overrides.layer ?? 0})
            },
            {
                type: "Transform", config: ({overrides}) => ({
                    position: {x: overrides.x ?? 0, y: overrides.y ?? 0},
                    z: 0,
                    rotation: 0,
                    scale: overrides.scale ?? {x: 1, y: 1},
                    size: {w: 0, h: 0},
                })
            },
            {
                type: "Visibility", config: ({overrides}) => ({visible: overrides.visible !== false})
            },
            {
                type: "UIText", config: ({overrides}) => ({
                    text: overrides.text ?? "",
                    ...overrides.style,
                    alpha: overrides.alpha ?? 1,
                })
            },
            {
                type: "UITextAnimation", optional: true, config: ({overrides}) => overrides.animation
            },
        ],
    },

    Rect: {
        name: "UI_Rect",
        components: [
            {
                type: "UI", config: ({overrides}) => ({layer: overrides.layer ?? 0})
            },
            {
                type: "Transform", config: ({overrides}) => ({
                    position: {x: overrides.x ?? 0, y: overrides.y ?? 0},
                    z: 0, rotation: 0,
                    scale: {x: 1, y: 1},
                    size: {w: overrides.rect?.w ?? 0, h: overrides.rect?.h ?? 0},
                })
            },
            {
                type: "Visibility", config: ({overrides}) => ({visible: overrides.visible !== false})
            },
            {
                type: "UIRect", config: ({overrides}) => ({
                    w: overrides.rect?.w,
                    h: overrides.rect?.h,
                    fillStyle: overrides.style?.fillStyle ?? "rgba(0,0,0,1)",
                    useOverlayAlpha: overrides.rect?.useOverlayAlpha ?? false,
                    alpha: overrides.alpha ?? 1,
                })
            },
        ],
    },
};
