import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4} from 'uuid'
import styles from './Project.module.css'
import Loading from '../../layouts/Loading/Loading'
import Container from '../../layouts/Container/Container'
import ProjectForm from '../../../objects/projects/ProjectForm'
import Mensagem from '../../../objects/Mensagem/Mensagem'
import ServiceForm from "../../services/ServiceForm/ServiceForm";
import ServiceCard from '../../services/ServiceCard/ServiceCard'

function Project(){

  const {id} = useParams()
  const [projeto, setProjeto] = useState([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [mensagem, setMensagem] = useState()
  const [tipo, setTipo] = useState()
  const [services, setServices] = useState([])

  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(resp => resp.json())
      .then(data => {
        setProjeto(data)
        setServices(data.services)
      })
      .catch((err) => {console.log(err)})  
    }, 500);
  }, [id])

  function editPost(projeto){
    setMensagem('')

    if(projeto.budget < projeto.cost){
      setMensagem('O orçamento não pode ser menor que o custo do projeto!')
      setTipo('erro')
      return false
    }

    fetch(`http://localhost:5000/projects/${projeto.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(projeto),
    })
    .then(resp => resp.json())
    .then((data) => {
      setProjeto(data)
      setShowProjectForm(false)
      setMensagem('Projeto atualizado!')
      setTipo('sucesso')
    })
    .catch(err => console.log(err))
  }

  function toggleProjectForm(){
    setShowProjectForm(!showProjectForm)
  }

  function toggleServiceForm(){
    setShowServiceForm(!showServiceForm)
  }

  function createService(projeto){
    setMensagem('')

    const ultimoServico = projeto.services[projeto.services.length -1]
    ultimoServico.id = uuidv4()

    const custoUltimoServico = ultimoServico.cost
    const novoCusto = parseFloat(projeto.cost) + parseFloat(custoUltimoServico)

    if(novoCusto > parseFloat(projeto.budget)){
      setMensagem('Orçamento ultrapassado, verifique o valor do serviço')
      setTipo('erro')
      projeto.services.pop()
      return false
    }

    projeto.cost = novoCusto

    fetch(`http://localhost:5000/projects/${projeto.id}`,{
      method: "PATCH",
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(projeto),
    })
    .then(resp => resp.json())
    .then((data) => {
      setShowServiceForm(false)
    })
    .catch(err => console.log(err))
  }

  function removeService(id, cost){
    const servicesUpdate = projeto.services.filter(
      (service) => service.id !== id
    )

    const projectupdated = projeto
    projectupdated.services = servicesUpdate
    projectupdated.cost = parseFloat(projectupdated.cost) - parseFloat(cost)
    
    fetch(`http://localhost:5000/projects/${projeto.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify(projeto),
    })
    .then(resp => resp.json())
    .then((data) => {
      setProjeto(projectupdated)
      setServices(servicesUpdate)
      setMensagem('Serviço removido!')
    })
    .catch(err => console.log(err))
  }

  return(
    <>
    {projeto.name ? (
    <div className={styles.project_details}>
      <Container customClass="column">
        {mensagem && <Mensagem tipo={tipo} texto={mensagem}/>}
        <div className={styles.details_container}>
          <h1>Pojeto: {projeto.name}</h1>
          <button className={styles.btn} onClick={toggleProjectForm}>
            {!showProjectForm ? 'Editar projeto' : 'Fechar'}
          </button>
            {!showProjectForm ? 
            (<div className={styles.project_info}>
              <p>
                <span>Categoria:</span> {projeto.category.name}
              </p>
              <p>
                <span>Total de orçamento:</span> R${projeto.budget}
              </p>
              <p>
                <span>Total utilizado:</span> R${projeto.cost}
              </p>
            </div>) 
            : (<div className={styles.project_info}>
              <ProjectForm handleSubmit={editPost} btnText="Concluir edição" projectData={projeto}/>
            </div>)}
        </div>
        <div className={styles.service_form_container}>
            <h2>Adicione um serviço:</h2>
            <button className={styles.btn} onClick={toggleServiceForm}>
            {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
            </button>
          <div className={styles.project_info}>
              {showServiceForm && 
                <ServiceForm 
                handleSubmit={createService}
                btnText="Adicionar serviço"
                projectData={projeto}
                />
              }
          </div>
        </div>
        <h2>Serviços</h2>
        <Container customClass="start">
          {services.length > 0 &&
            services.map((service) => (
              <ServiceCard
              id={service.id}
              name={service.name}
              cost={service.cost}
              description={service.description}
              key={service.id}
              handleRemove={removeService}
              />
            ))
          }

          {services.length === 0 && <p>Não há serviços cadastrados</p>}
        </Container>
      </Container>
    </div> )
    : (<Loading/>)
    }
    </>
  )
}

export default Project