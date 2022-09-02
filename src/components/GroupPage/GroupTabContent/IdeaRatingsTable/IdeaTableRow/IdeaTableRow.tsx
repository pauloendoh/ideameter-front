import Flex from "@/components/_common/flexboxes/Flex";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import MyReactLinkify from "@/components/_common/text/MyReactLinkify/MyReactLinkify";
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation";
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import { Box, Checkbox, TableCell, TableRow, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdDescription } from "react-icons/md";
import HighestSubideaInfo from "../HighestSubideaInfo/HighestSubideaInfo";
import RatingInput from "../RatingInput/RatingInput";

interface Props {
  ideaRating: IdeaRating;
  rowNumber: number;
}

const IdeaTableRow = (props: Props) => {
  const router = useRouter();
  const { openDialog } = useIdeaDialogStore();
  const query = router.query as { groupId: string };

  const { mutate: submitSaveIdea } = useSaveIdeaMutation();

  const hasSubideas = useMemo(() => props.ideaRating.subideas.length > 0, [
    props.ideaRating.subideas,
  ]);

  return (
    <TableRow
      hover
      sx={{ ":hover": { cursor: "pointer" } }}
      onClick={() => openDialog(props.ideaRating.idea)}
    >
      <TableCell align="center">{props.rowNumber}</TableCell>
      <TableCell>
        <FlexCol style={{ gap: 8 }}>
          {props.ideaRating.idea.labels?.length > 0 && (
            <Flex style={{ flexWrap: "wrap", gap: 4 }}>
              {props.ideaRating.idea.labels.map((label) => (
                <div
                  key={label.id}
                  style={{
                    background: label.bgColor,
                    padding: "2px 4px",
                    borderRadius: 4,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {label.name}
                </div>
              ))}
            </Flex>
          )}
          <Box style={{ display: "inline-flex" }}>
            <span
              style={{
                whiteSpace: "break-spaces",
                fontWeight: hasSubideas ? "bold" : undefined,
              }}
            >
              <MyReactLinkify openNewTab stopPropagation>
                {props.ideaRating.idea.name}
              </MyReactLinkify>

              {props.ideaRating.idea.description.length > 0 && (
                <Tooltip title={props.ideaRating.idea.description}>
                  <span>
                    <MdDescription
                      style={{ position: "relative", top: 2, left: 8 }}
                    />
                  </span>
                </Tooltip>
              )}
            </span>
          </Box>

          {hasSubideas && (
            <HighestSubideaInfo ideaId={props.ideaRating.idea.id} />
          )}
        </FlexCol>
      </TableCell>
      <TableCell>
        <Checkbox
          checked={props.ideaRating.idea.isDone}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            submitSaveIdea({
              ...props.ideaRating.idea,
              isDone: e.target.checked,
            });
          }}
          inputProps={{ "aria-label": "controlled" }}
        />
      </TableCell>
      <TableCell
        align="center"
        sx={{
          background:
            Number(props.ideaRating.avgRating) >= 2.5 ? "#232323" : undefined,
        }}
      >
        {props.ideaRating.avgRating}
      </TableCell>
      <TableCell align="center">
        <RatingInput
          idea={props.ideaRating.idea}
          groupId={query.groupId}
          parentId={props.ideaRating.idea.parentId}
        />
      </TableCell>
      {props.ideaRating.otherUserGroupRatings.map((userGroupRating, index) => (
        <TableCell key={JSON.stringify(userGroupRating)} align="center">
          {userGroupRating.rating}
        </TableCell>
      ))}

      <TableCell></TableCell>
    </TableRow>
  );
};

export default IdeaTableRow;
