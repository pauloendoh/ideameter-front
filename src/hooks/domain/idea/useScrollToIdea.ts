import { useTheme } from "@mui/material";

export const useScrollToIdea = () => {
  const theme = useTheme();
  const scrollToIdea = (ideaId: string) => {
    setTimeout(() => {
      const row = document.querySelector<HTMLElement>(`#idea-${ideaId}`);
      const table = document.querySelector(".MuiTableContainer-root");
      const thead = document.querySelector<HTMLElement>(".MuiTableRow-head");

      if (row && table && thead) {
        const tableTop = table.getBoundingClientRect().top;
        const theadHeight = thead.offsetHeight;

        const rowTop = row.getBoundingClientRect().top + table.scrollTop;
        const top = rowTop - (tableTop + theadHeight);

        table.scrollTo({
          top: top,
        });

        row.classList.add("highlight-idea-row");

        setTimeout(() => {
          const row = document.querySelector<HTMLElement>(`#idea-${ideaId}`);
          if (row) row.classList.remove("highlight-idea-row");
        }, 2000);
      }
    }, 250);
  };

  return scrollToIdea;
};
