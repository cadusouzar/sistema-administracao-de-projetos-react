import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Mensagem from "../../../objects/Mensagem/Mensagem";
import Container from '../../layouts/Container/Container'
import LinkButton from '../../../objects/LinkButton/LinkButton'
import ProjectCard from "../../../objects/ProjectCard/ProjectCard";
import Loading from "../../layouts/Loading/Loading";
import styles from './Projects.module.css'

function Projects() {  

  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')
  const location = useLocation()
  let texto = ""

  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:5000/projects",{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(resp => resp.json())
      .then(data => {
        setProjects(data)
        setRemoveLoading(true)
      })
      .catch((err) => {console.log(err)})
    }, 700);
    }, [])

    function removeProject(id){
      fetch(`http://localhost:5000/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(resp => resp.json())
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id))
        setProjectMessage('Projeto removido com sucesso')
      })
      .catch()
    }

  if(location.state){
    texto = location.state.message
  }

    return(
      <div className={styles.project_container}>
        <div className={styles.title_container}>
          <h1>Meus Projetos</h1> 
          <LinkButton to="/newproject" text="Criar projeto"/>        
        </div>

        {texto && <Mensagem texto={texto} tipo="sucesso"/>}
        {projectMessage && <Mensagem texto={projectMessage} tipo="sucesso"/>}

        <Container customClass="start">
          {projects.length > 0 &&
            projects.map((projetos) => (<ProjectCard 
              id={projetos.id}
              nome={projetos.name} 
              budget={projetos.budget} 
              categoria={projetos.category.name} 
              key={projetos.id} 
              handleRemove={removeProject}
              />
            ))
          }

          {!removeLoading && <Loading/>}
          {removeLoading && projects.length===0 ? (
            <p>Não há projetos cadastrados</p>
          ) : null}
        </Container>
      </div>
    )
}

export default Projects