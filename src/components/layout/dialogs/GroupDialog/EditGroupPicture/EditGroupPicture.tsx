import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { Avatar, Box } from "@mui/material"
import { ChangeEvent, createRef } from "react"
import { MdPhotoCamera } from "react-icons/md"

interface Props {
  groupName: string
  imageUrl: string | null
  onChangeImageUrl: (newValue: string | null) => void
}

const EditGroupPicture = (props: Props) => {
  const fileInput = createRef<HTMLInputElement>()

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const setSuccessMessage = useSnackbarStore((s) => s.setSuccessMessage)

  const axios = useAxios()

  const handleFileUpload = (file: File) => {
    const formData = new FormData()
    formData.append("file", file, file.name)

    axios.put<string>(urls.api.groupImage, formData).then((res) => {
      setSuccessMessage("Image uploaded!")

      // ignore token and expiration

      props.onChangeImageUrl(res.data)
      // editProfilePicture(res.data);
    })
  }

  return (
    <>
      <Box
        position="relative"
        onClick={() => {
          if (fileInput?.current) {
            fileInput.current.click()
          }
        }}
      >
        <Avatar
          src={props.imageUrl || props.groupName}
          alt={props.groupName}
          style={{
            width: 96,
            height: 96,
            cursor: "pointer",
          }}
        >
          {props.groupName.substring(0, 2)}
        </Avatar>

        <MdPhotoCamera
          size={24}
          style={{
            position: "absolute",
            bottom: 36,
            left: 36,
            cursor: "pointer",
          }}
        />

        <input
          style={{ display: "none" }}
          type="file"
          onChange={handleFileSelection}
          ref={fileInput}
        />
      </Box>
    </>
  )
}

export default EditGroupPicture
