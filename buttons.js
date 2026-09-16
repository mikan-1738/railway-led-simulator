button.addEventListener(
    "click",
    () => {

        // 同じグループの選択状態を解除
        const parent = button.parentElement;

        if (parent) {
            parent
                .querySelectorAll("button")
                .forEach((btn) => {
                    btn.classList.remove("selected");
                });
        }

        // 押したボタンを選択状態にする
        button.classList.add("selected");

        onClick(id);
    }
);
