//Função unica que carrega todos os gráficos ----------------

async function carregarGraficos(){
    //----------------tratamento das URls----------------
        $dadosUsuarios = await fetch('http://localhost/api/back/usuarios.php');
        $dadosChamadas = await fetch('http://localhost/api/back/chamadas.php');
        $dadosVendas = await fetch('http://localhost/api/back/vendas.php');
  
        $resUsuarios = await $dadosUsuarios.json();
        $resChamadas = await $dadosChamadas.json();
        $resVendas = await $dadosVendas.json();
  
        //------------PEGAR DATA DO SISTEMA---------------------
        const date = new Date();
        const hoje = '2025-04-08'  //------date.toISOString().slice(0, 10);  
        let ontem = hoje.slice(0,9) + (hoje.slice(9) - 1);
        const mes = date.toISOString().slice(0, 7)
  
        //----------iniciando variaveis para as tabelas----------------
        let contratosDia = 0;
        let adesaoBoleto = 0;
        let instaladosMes = 0;
        let contratosMes = 0;
        let vendasBoleto = 0.0;
        let vendasTotal = 0.0;
        let propostas = 0;
        let chamadasDia = 0;
        let formularios = 0;
        let formulariosPedidos = 0;
        let leadsBlip = 0;
        let televendas = 0;
        let chat = 0;
        let propostasMes = 0;
        let chamadasEmEspera = 0;
  
        let propostasOntem = 0;
        let leadsBlipOntem = 0;
  
        let quantidadePorUsuarioBoleto = [];
        let quantidadePorUsuarioPropostas = [];
        let quantidadePorUsuarioContrato = [];
  
        //------------------ Completando primeira tabela--------------------
        for (let i = 0; i < $resVendas.dados.length; i++) {
          const venda = $resVendas.dados[i];
        //------------------contadores por data ------------------------------
          if (venda.contratos !== null && venda.dataContrato !== null) {
            if (venda.dataContrato.slice(0, 10) === hoje) contratosDia++;
            if (venda.dataContrato.slice(0, 7) === mes) contratosMes++;
          }
          if (venda.tipoDePagamento === 'boleto') {
            if (venda.dataVenda.slice(0, 7) === mes) vendasBoleto += venda.valor;
            if (venda.dataVenda.slice(0, 10) === hoje) adesaoBoleto++;
          }
          if (venda.dataVenda !== null && venda.dataVenda.slice(0, 7) === mes)vendasTotal += venda.valor;
          if (venda.dataInstalacao !== null && venda.dataInstalacao.slice(0, 7) === mes)instaladosMes++;
          if (venda.dataVenda !== null && venda.dataVenda.slice(0, 10) === hoje)propostas++;
          if (venda.dataVenda !== null && venda.dataVenda.slice(0, 10) === ontem)propostasOntem++;
          if(venda.dataVenda !== null && venda.dataVenda.slice(0 ,7) === mes)propostasMes ++;
      
          // ---------------------origem das vendas---------------------
          if (venda.formularios === 1) formulariosPedidos++;
          if (venda.leadsblip === 1) leadsBlip++;
          if (venda.leadsblip === 1 && venda.dataVenda.slice(0, 10) === ontem) leadsBlipOntem++;
          if (venda.propostas === null) formularios++;
          if (venda.leadsblip === 0 && venda.formularios === 0) televendas++;
          if (venda.chat === 1) chat++;
          // --------------------contagens por usuario ----------------------
          const idUsuario = venda.id_usuario;
          if (idUsuario !== null) {
  
            if (venda.tipoDePagamento === 'boleto') {
              if (!quantidadePorUsuarioBoleto[idUsuario]) quantidadePorUsuarioBoleto[idUsuario] = 0;
              quantidadePorUsuarioBoleto[idUsuario]++;
            }
            if (venda.contratos !== null) {
              if (!quantidadePorUsuarioContrato[idUsuario]) quantidadePorUsuarioContrato[idUsuario] = 0;
              quantidadePorUsuarioContrato[idUsuario]++;
            }
            if (venda.propostas !== null) {
              if (!quantidadePorUsuarioPropostas[idUsuario]) quantidadePorUsuarioPropostas[idUsuario] = 0;
              quantidadePorUsuarioPropostas[idUsuario]++;
            }
          }
        }
  
        //-----------------------------chamadas dia e por user -------------------------------
        const chamadasPorUsuario = {}; 
  
        for (let i = 0; i < $resChamadas.length; i++) {
          const chamada = $resChamadas[i];
          console.log(chamada.idUsuario === null)
  
          if (chamada.dataChamada !== null && chamada.dataChamada.slice(0, 10) === hoje) {
            chamadasDia++;
            const id = chamada.idUsuario;
  
            if (!chamadasPorUsuario[id]) {
              chamadasPorUsuario[id] = 0;
            }
            chamadasPorUsuario[id]++;
            
            if(id === null){
              chamadasEmEspera++;
              console.log(chamadasEmEspera);
            }
          }
        }
  

        // preenhcendo os campos da tabela ---------------------
        let conversaoDia = propostas / chamadasDia;
        let mensalidadeBoleto = (vendasBoleto / vendasTotal) * 100; 
        
        document.getElementById('proposta_dia').textContent = propostas;
        document.getElementById('contratos_dia').textContent = contratosDia;
        document.getElementById('total_leads').textContent = leadsBlip;
        document.getElementById('conversao_dia').textContent = conversaoDia.toFixed(2)+'%';
        document.getElementById('custo_dia').textContent =  propostas / 2;
        
        document.getElementById('adesao_boleto').textContent = adesaoBoleto;
        document.getElementById('mensalidade_boleto').textContent = mensalidadeBoleto.toFixed(2)+"%";
        document.getElementById('propostas_mes').textContent = propostasMes; 
        document.getElementById('contratos_mes').textContent = contratosMes;
        document.getElementById('instaladas_mes').textContent = instaladosMes;
  
        document.getElementById('usuario_01').textContent = $resUsuarios[2].nome;
        document.getElementById('usuario_02').textContent = $resUsuarios[1].nome; 
        document.getElementById('usuario_03').textContent = $resUsuarios[3].nome;
        document.getElementById('usuario_04').textContent = $resUsuarios[4].nome;
        
        
  
        //------------------------------Gráficos Pizza-------------------------------
        
        //objeto para pegar dados por user ---------------------------
        boletosPorUsuario = {};
        const contratosPorUsuario = {};
        const propostasPorUsuario = {};
  
        for (let i = 0; i < $resVendas.dados.length; i++) {
          const venda = $resVendas.dados[i];
          const id = venda.id_usuario;
  
          if (venda.tipoDePagamento === 'boleto') {
            boletosPorUsuario[id] = (boletosPorUsuario[id] || 0) +1;
          }
  
          if (venda.contratos !== null) {
            contratosPorUsuario[id] = (contratosPorUsuario[id] || 0) +1;
          }
  
          if (venda.propostas !== null) {
            propostasPorUsuario[id] = (propostasPorUsuario[id] || 0) +1;
          }
        }
  
  
      const pizza = document.getElementById("pizza");
      new Chart(pizza, {
        type: "pie",
        data: {
          labels: ["Contratos", "Proposta", "Mensalidade boleto", "Conversão"],
          datasets: [
            {
              label: $resUsuarios[2].nome,
              data: [contratosPorUsuario[3], propostasPorUsuario[3], boletosPorUsuario[3], 
              (propostasPorUsuario[3] / chamadasPorUsuario[3]) * 100],
              borderWidth: 1,
            },
          ],
        },
      });
  
        const pizza1 = document.getElementById("pizza1");
        new Chart(pizza1, {
          type: "pie",
          data: {
            labels: ["Contratos", "Proposta", "Mensalidade boleto", "Conversão"],
            datasets: [
              {
                label: $resUsuarios[1].nome,
                data: [contratosPorUsuario[2], propostasPorUsuario[2], boletosPorUsuario[2],
                 (propostasPorUsuario[2] / chamadasPorUsuario[2]) * 100],
                borderWidth: 1,
              },
            ],
          },
        });
        const pizza2 = document.getElementById("pizza2");
        new Chart(pizza2, {
          type: "pie",
          data: {
            labels: ["Contratos", "Proposta", "Mensalidade boleto", "Conversão"],
            datasets: [
              {
                label: $resUsuarios[3].nome,
                data: [contratosPorUsuario[4], propostasPorUsuario[4], boletosPorUsuario[4], 
                (propostasPorUsuario[4] / chamadasPorUsuario[4]) * 100],
                borderWidth: 1,
              },
            ],
          },  
        });
        const pizza3 = document.getElementById("pizza3");
        new Chart(pizza3, {
          type: "pie",
          data: {
            labels: ["Contratos", "Proposta", "Mensalidade boleto", "Conversão"],
            datasets: [
              {
                label: $resUsuarios[4].nome,
                data: [contratosPorUsuario[5], propostasPorUsuario[5], boletosPorUsuario[5],
                (propostasPorUsuario[5] / chamadasPorUsuario[5]) * 100],
                borderWidth: 1,
              },
            ],
          },
        });
  
        
        //-----------------------Gráfico Barra------------------------------
  
        
        const ctx = document.getElementById("myChart");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Chamadas", "Chat"],
            datasets: [ 
              {
                label: "em Espera",
                data: [chamadasEmEspera, 1],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      
  
        const barra = document.getElementById("barra");
        new Chart(barra, {
          type: "bar",  
          data: {
            labels: ["Chamadas", "Pedidos","Conversão"],
            datasets: [ 
              {
                label: "Televendas",
                data: [chamadasDia *10,televendas *20 , (chamadasDia / televendas) * 100],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
  
        
        const barra1= document.getElementById("barra1");
        new Chart(barra1, {
          type: "bar",
          data: {
            labels: ["Formulários", "Pedidos","Conversão"],
            datasets: [ 
              {
                label: "Formulários",
                data: [formularios *10, formulariosPedidos*10, (formularios / formulariosPedidos) * 100],
                borderWidth: 1, 
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        
        new Chart(barra2, {
          type: "bar",
          data: {
            labels: ["Leads Blip", "Pedidos","Conversão"],
            datasets: [
              {
                label: "Chat",
                data: [leadsBlip *10, chat *20, (chat/leadsBlip) * 100],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });  
        
        
        
        //funcao para pegar os dados de horas e minutos atuais no sistema-----------------
        
        function getHorarioAtual() {
            const hora = date.getHours().toString().padStart(2, '0');
            const minutos = date.getMinutes();
            return `${hora}:${minutos.toString().padStart(2, '0')}`;
        }
        
          function getHorariosMenos10e20() {
              let hora = date.getHours();
              let minutos = date.getMinutes();
              
          let minutos10 = minutos - 10;
          let hora10 = hora;
          if (minutos10 < 0) {
              minutos10 += 60;
              hora10 -= 1;
            }
            
            let minutos20 = minutos - 20;
            let hora20 = hora;
            if (minutos20 < 0) {
                minutos20 += 60;
                hora20 -= 1;
            }
            
            const horario10 = `${hora10.toString().padStart(2, '0')}:${minutos10.toString().padStart(2, '0')}`;
            const horario20 = `${hora20.toString().padStart(2, '0')}:${minutos20.toString().padStart(2, '0')}`;
            
            return [horario10, horario20];
        }
        
        
        // variaveis para preencher os gráficos de horas ------------------------- 
        
        const horarioAtual = getHorarioAtual();
        let chamadasHr = 0;
        let propostasHr = 0;
        let pedidosHr = 0;
        let leadsHr = 0;
        
        let chamadas12 = 0;
        let chamadas13 = 0;
        let chamadas14 = 0;
        let chamadas15 = 0;
        
        let pedidos12 = 0;
        let pedidos13 = 0;
        let pedidos14 = 0;
        let pedidos15 = 0;
        
        let chamadasHr10 = 0;
        let chamadasHr20 = 0;
        let pedidosHr10 = 0;
        let pedidosHr20 = 0;
        
        let leads12 = 0;
        let leads13 = 0;
        let leads14 = 0;
        let leads15 = 0;
        
        let leadsBlip10 = 0;
        let leadsBlip20 = 0;
        
        
        let [h10, h20] = getHorariosMenos10e20();
        
        // percorrendo chamadas e vendas para pegando dados por horario -------------------------
        
        for (let i = 0; i < $resChamadas.length; i++) {
            const c = $resChamadas[i];
            let hrChamada = c.dataChamada.slice(11, 16);
            
            if (hrChamada <= getHorarioAtual() && c.dataChamada.slice(0, 10) ===  hoje)chamadasHr++;
          if (hrChamada <= h10 && c.dataChamada.slice(0, 10) ===  hoje)chamadasHr10++;
          if (hrChamada <= h20 && c.dataChamada.slice(0, 10) ===  hoje)chamadasHr20++;
          
          if(hrChamada <= '12:00' && c.dataChamada.slice(0, 10) ===  hoje)chamadas12++;
          if(hrChamada <= '13:00' && c.dataChamada.slice(0, 10) ===  hoje)chamadas13++;
          if(hrChamada <= '14:00' && c.dataChamada.slice(0, 10) ===  hoje)chamadas14++;
          if(hrChamada <= '15:00' && c.dataChamada.slice(0, 10) ===  hoje)chamadas15++;
        }
        
        
        for (let i = 0; i < $resVendas.dados.length; i++) {
            const v = $resVendas.dados[i];
            let hrVenda = v.dataVenda.slice(11, 16);
            
            if (hrVenda <= h10 && v.dataVenda.slice(0, 10) ===  hoje){
              pedidosHr10++;
              if(v.leadsBlip === 1)leadsBlip10++;
            }
            if (hrVenda <= h20 && v.dataVenda.slice(0, 10) ===  hoje){
                pedidosHr20++;
                if(v.leadsBlip === 1)leadsBlip20++;
            }
  
            if (hrVenda <= getHorarioAtual() && v.dataVenda.slice(0, 10) ===  hoje) {
                if (v.propostasHr !== null) propostasHr++;
            if (v.pedidosHr !== 0) pedidosHr++;
            if (v.leadsblip === 1) leadsHr++;
        }         
        
        if(hrVenda <= '12:00' && hrVenda > '13:00' && v.dataVenda.slice(0, 10) ===  hoje)pedidos12++;
        if(hrVenda <= '12:00' && hrVenda > '13:00' && v.dataVenda.slice(0, 10) === hoje  && v.leadsblip === 1) leads12++;
        
        if(hrVenda <= '13:00' && hrVenda > '14:00'&& v.dataVenda.slice(0, 10) === hoje)pedidos13++;
        if(hrVenda <= '13:00' && hrVenda > '14:00'&& v.dataVenda.slice(0, 10) === hoje && v.leadsblip === 1)
            leads13++;
        
        if(hrVenda <= '14:00'&& hrVenda > '15:00'&& v.dataVenda.slice(0, 10) === hoje && v.leadsblip === 1)pedidos14++;
        if(hrVenda <= '14:00'&& hrVenda > '15:00'&& v.dataVenda.slice(0, 10) === hoje)leads14++;
        
        if(hrVenda <= '15:00' && v.dataVenda.slice(0, 10) === hoje)pedidos15++;
        if(hrVenda <= '15:00' && v.dataVenda.slice(0, 10) === hoje && v.leadsblip === 1)leads15++;
    }
    
    const conversaoHr = chamadasHr > 0 ? propostasHr / chamadasHr : 0;
    
    //--------------------Gráficos linha----------------------------//
    
    const line = document.getElementById("line");
    new Chart(line, {
        type: "line",
        data: {
            labels: [h20,h10,getHorarioAtual()],
            datasets: [ 
                {
                    label: "Conversão",
                    data: [(pedidosHr20/chamadasHr20) * 10, (pedidosHr10/chamadasHr) * 10 , ( pedidosHr/chamadasHr) * 10],
                fill: false,
                borderColor: "rgb(0100, 200, 100)",
                tension: 0.1,
              },
              {
                label: "Pedidos",
                data: [pedidosHr20, pedidosHr10, pedidosHr],
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
              },
              {
                label: "Leads",
                data: [leadsBlip10,leadsBlip20,leadsHr],
                fill: false,
                borderColor: "rgb(54, 162, 235)",
                tension: 0.1,
              },
              {
                label: "Meta Pedidos",
                data: [4, 4, 4],
                fill: false,
                borderDash: [5,5],
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
              },
              {
                label: "Meta Leads",
                data: [16, 16, 16],
                fill: false,
                borderDash: [5,5],
                borderColor: "rgb(54, 162, 235)",
                tension: 0.1,
              }
            ],
          },
        });
  
        const line1 = document.getElementById("line1");
        new Chart(line1, {
          type: "line",
          data: {
            labels: ["12:00","13:00","14:00","15:00"],
            datasets: [ 
              {
                label: "Conversão",
                data: [(pedidos12/chamadas12) * 10, (pedidos13/chamadas13) * 10 , (pedidos14/chamadas14) * 10,(pedidos15/chamadas15) * 10],
                fill: false,
                borderColor: "rgb(0100, 200, 100)",
                tension: 0.1,
              },
              {
                label: "Pedidos",
                data: [pedidos12, pedidos13, pedidos14, pedidos15],
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
              },
              {
                label: "Leads",
                data: [leads12, leads13, leads14,leads15],
                fill: false,
                borderColor: "rgb(54, 162, 235)",
                tension: 0.1,
              },
              {
                label: "Meta Pedidos",
                data: [4, 4, 4,4],
                fill: false,
                borderDash: [5,5],
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
              },
              {
                label: "Meta Leads",
                data: [20, 20, 18, 19],
                fill: false,
                borderDash: [5,5],
                borderColor: "rgb(54, 162, 235)",
                tension: 0.1,
              }
            ],
          },
        });
        
        const line2 = document.getElementById("line2");
        new Chart(line2, {
          type: "line",
          data: {
            labels: [ontem, hoje],
            datasets: [ 
              {
                label: "Conversão", 
                data: [(leadsBlipOntem / propostasOntem) * 10,(leadsBlip / propostas) * 10],
                fill: false,
                borderColor: "rgb(0100, 200, 100)",
                tension: 0.1,
              },
              {
                label: "Pedidos",
                data: [propostasOntem,propostas],
                fill: false,
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
              },
              {
                label: "Leads",
                data: [leadsBlipOntem,leadsBlip],
                fill: false,
                borderColor: "rgb(54, 162, 235)",
                tension: 0.1,
              },
              {
                label: "Meta Pedidos",
                data: [48,48],
                fill: false,
                borderDash: [5,5,5],
                borderColor: "rgb(255, 99, 132)",
                tension: 0.1,
              },
              {
                label: "Meta Leads",
                data: [50,50],
                fill: false,
                borderDash: [5,5],
                borderColor: "rgb(54, 162, 235)",
                tension: 0.1,
              }
            ],
          },
        });
      }