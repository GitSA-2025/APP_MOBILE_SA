import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView, ScrollView} from "react-native";
import { BarChart } from "react-native-chart-kit";
import api from '../../api/api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import styles from "./styles";

export default function Repost() {

    // Estado do sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Pegando parâmetros da rota (email do usuário)
    const route = useRoute();
    const { user_email } = route.params;

    // Estados para datas de início e fim do relatório
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    // Estado para armazenar os dados retornados da API
    const [dados, setDados] = useState(null);

    // Estado de loading durante requisições
    const [loading, setLoading] = useState(false);

    // Estados para os totais exibidos
    const [totalGeral, setTotalGeral] = useState(0);
    const [valorColaboradores, setValorColaboradores] = useState(0);
    const [valorVisitantes, setValorVisitantes] = useState(0);
    const [valorEntregadores, setValorEntregadores] = useState(0);

    // Função para gerar gráfico
    const gerarGrafico = async () => {
        // Validação de campos
        if (!dataInicio || !dataFim) {
            alert("Selecione as duas datas!");
            return;
        }

        setLoading(true);
        try {
            // Requisição para API passando o período selecionado
            const res = await api.post(
                '/api/mobile/app/gerarGraficoIA',
                { dataInicio, dataFim },
                { headers: { "Content-Type": "application/json" } }
            );
            const graficoData = res.data.grafico;

            console.log("Dados do Gráfico Recebidos:", graficoData);

            // Variáveis temporárias para somar os valores
            let somaTotal = 0;
            let colab = 0;
            let vis = 0;
            let entr = 0;

            // Calculando totais
            graficoData.forEach(item => {
                const valor = Number(item.value);
                somaTotal += valor;

                switch (item.label) {
                    case "Colaboradores":
                        colab = valor;
                        break;
                    case "Visitantes":
                        vis = valor;
                        break;
                    case "Entregadores":
                        entr = valor;
                        break;
                    default:
                        break;
                }
            });

            // Atualizando estados com os valores calculados
            setTotalGeral(somaTotal);
            setValorColaboradores(colab);
            setValorVisitantes(vis);
            setValorEntregadores(entr);

            // Atualizando dados do gráfico
            setDados(graficoData);
        }
        catch (err) {
            console.error(err);
            alert("Erro ao gerar gráfico. Tente novamente.");
        }
        finally {
            setLoading(false); // Finaliza loading mesmo em caso de erro
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Sidebar lateral */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Conteúdo principal com ajuste de margem caso sidebar aberto */}
            <View style={{ flex: 1, marginLeft: sidebarOpen ? 230 : 0 }}>
                <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                
                {/* Painel de filtros */}
                <View style={styles.header}>
                    <Text style={styles.textHeader}> Relatórios | </Text>
                    <Text style={styles.textHeader}> Data inicio </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="dd-mm-aaaa"
                        value={dataInicio}
                        onChangeText={setDataInicio}
                    />
                    <Text style={styles.textHeader}> Data final </Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="dd-mm-aaaa"
                        value={dataFim}
                        onChangeText={setDataFim}
                    />
                    <TouchableOpacity style={styles.btn} onPress={gerarGrafico}>
                        <Text style={styles.btnText}>Gerar gráfico</Text>
                    </TouchableOpacity>
                </View>

                {/* Loading durante requisição */}
                {loading ? (
                    <ActivityIndicator size="large" color="#2B3D52" style={{ marginTop: 20 }} />
                ) : dados ? (
                    <View style={styles.secoundContainer}>

                        {/* Painel esquerdo mostrando os totais */}
                        <SafeAreaView style={styles.painelLeft}>
                            <Text style={styles.textDesc}>
                                Segundo os dados analisados pela IA, {totalGeral} acessaram a empresa neste periodo. Sendo elas:
                            </Text>
                            <View style={styles.labelColabo}>
                                <Text style={styles.labelText}>{valorColaboradores} Colaboradores</Text>
                            </View>
                            <View style={styles.labelVisit}>
                                <Text style={styles.labelText}>{valorVisitantes} Visitantes</Text>
                            </View>
                            <View style={styles.labelEntr}>
                                <Text style={styles.labelText}>{valorEntregadores} Entregadores</Text>
                            </View>
                        </SafeAreaView>

                        {/* Painel direito mostrando gráfico de barras */}
                        <View style={styles.painelRight}>
                            <BarChart
                                data={{
                                    labels: dados.map((d) => d.label),
                                    datasets: [{
                                        data: dados.map((d) => d.value),
                                        colors: [
                                            (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                                            (opacity = 1) => `rgba(249, 168, 37, ${opacity})`,
                                            (opacity = 1) => `rgba(239, 108, 0, ${opacity})`,
                                        ]
                                    }],
                                }}
                                width={Dimensions.get("window").width * 0.5} // Largura do gráfico
                                height={280}
                                yAxisLabel=""
                                withCustomBarColorFromData={true}
                                flatColor={true}
                                chartConfig={{
                                    backgroundColor: "#ffffffff",
                                    backgroundGradientFrom: "#f4f4f5",
                                    backgroundGradientTo: "#f4f4f5",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
                                    style: { borderRadius: 16 },
                                    barPercentage: 0.7,
                                    barRadius: 5,
                                }}
                                style={{ marginVertical: 10, borderRadius: 16, borderColor: '#2b3d528a', borderWidth: 2 }}
                                verticalLabelRotation={0}
                            />
                        </View>
                    </View>
                ) : (
                    // Mensagem inicial quando não há dados
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ marginTop: 20, color: "#666", fontSize: 20, alignItems: 'center' }}>
                            Selecione o período e gere o gráfico.
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}
