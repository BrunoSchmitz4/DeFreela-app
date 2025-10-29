import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";


function Home() {

    let navigate = useNavigate();
    return (
        <>
          <h2>Essa é a Home</h2>
          <p>Demonstração provisória de elementos</p>
          <Button variant="secondary" children={"Sou o botão secundário"} disabled type={"reset"}/>
          <Button variant="primary" children={"Já eu... o primário"} type={"submit"} onClick={() => navigate("/projects")}/>
          <Input type="text" placeholder={"Como posso te chamar?"} error={"Esse campo não pode ficar vazio, viu?"}/>
          <Input type="number" placeholder={"E qual a sua idade?"}/>
          <Input type="checkbox" label={"Você prestará serviço de freelancer?"}/>
        </>
    )
}

export default Home;