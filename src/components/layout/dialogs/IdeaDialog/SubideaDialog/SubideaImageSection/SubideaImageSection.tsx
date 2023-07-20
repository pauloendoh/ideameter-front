import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useCallback, useRef } from "react"
import { IoMdCloseCircleOutline } from "react-icons/io"

type Props = {
  subidea: IdeaDto
  onChangeImageUrl: (imageUrl: string) => void
}

const SubideaImageSection = ({ ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.[0]) {
      // upload
      handleImageUpload(files[0]).then((imageUrl) => {
        props.onChangeImageUrl(imageUrl)
      })
    }
  }

  const axios = useAxios()

  const handleImageUpload = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append("file", file)

        axios
          .post<string>(urls.api.subideaImage, formData)
          .then((res) => {
            return resolve(res.data)
          })
          .catch(() => reject(new Error("Upload failed")))
      }),
    []
  )

  return (
    <div className="SubideaImageSection">
      <div>
        {!props.subidea.subideaImageUrl && (
          <DarkButton
            onClick={() => {
              inputRef.current?.click()
            }}
          >
            + Add image
          </DarkButton>
        )}

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {props.subidea.subideaImageUrl && (
          <div
            style={{
              position: "relative",
              width: "fit-content",
            }}
          >
            <a href={props.subidea.subideaImageUrl} target="_blank">
              <img
                src={props.subidea.subideaImageUrl}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            </a>
            <IoMdCloseCircleOutline
              size={24}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                props.onChangeImageUrl("")
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SubideaImageSection
