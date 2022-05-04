export default interface GroupTabPostDto {
  name: string;
}

const newGroupTabPostDto = (): GroupTabPostDto => ({
  name: "",
});
