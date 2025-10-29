import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet, SafeAreaView, SafeAreaViewBase } from "react-native";
import { BarChart } from "react-native-chart-kit";
import api from '../../api/api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import styles from "./styles";

export default function Repost() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const route = useRoute();
    const { user_email } = route.params;

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(false);


    const [totalGeral, setTotalGeral] = useState(0);
    const [valorColaboradores, setValorColaboradores] = useState(0);
    const [valorVisitantes, setValorVisitantes] = useState(0);
    const [valorEntregadores, setValorEntregadores] = useState(0);

    const gerarGrafico = async () => {
        if (!dataInicio || !dataFim) {
            alert("Selecione as duas datas!");
            return;
        }

        setLoading(true);
        try {
            const dados = { dataInicio, dataFim };

            const res = await api.post('/api/mobile/app/gerarGraficoIA', dados);
            const graficoData = res.data.grafico;

            console.log("Dados do Gráfico Recebidos:", graficoData);

            let somaTotal = 0;
            let colab = 0;
            let vis = 0;
            let entr = 0;

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

            setTotalGeral(somaTotal);
            setValorColaboradores(colab);
            setValorVisitantes(vis);
            setValorEntregadores(entr);

            setDados(graficoData);
        }
        catch (err) {
            console.error(err);
            alert("Erro ao gerar gráfico. Tente novamente.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <View style={{ flex: 1, marginLeft: sidebarOpen ? 230 : 0 }}>
                <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.textHeader}> Relatórios | </Text>
                    <Text style={styles.textHeader}> Data inicio </Text>
                    <TextInput style={styles.textInput} placeholder="dd-mm-aaaa" value={dataInicio} onChangeText={setDataInicio} />
                    <Text style={styles.textHeader}> Data final </Text>
                    <TextInput style={styles.textInput} placeholder="dd-mm-aaaa" value={dataFim} onChangeText={setDataFim} />
                    <TouchableOpacity style={styles.btn} onPress={gerarGrafico}>
                        <Text style={styles.btnText}>Gerar gráfico</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2B3D52" style={{ marginTop: 20 }} />
                ) : dados ? (
                    <View style={styles.secoundContainer}>

                        {/* Dados */}

                        <View style={styles.painelLeft}>
                            <Text style={styles.textDesc}>De acordo com os dados analisados pela IA, o total de pessoas que tiveram o acesso a empresa durante o periodo foi de {totalGeral} pessoas, sendo elas:</Text>
                            <View style={styles.labelColabo}>
                                <Text style={styles.labelText}>{valorColaboradores} Colaboradores</Text>
                            </View>
                            <View style={styles.labelEntr}>
                                <Text style={styles.labelText}>{valorEntregadores} Entregadores</Text>
                            </View>
                            <View style={styles.labelVisit}>
                                <Text style={styles.labelText}>{valorVisitantes} Visitantes</Text>
                            </View>
                        </View>
                        {/*Gráfico*/}
                        <View style={styles.painelRight}>
                            <BarChart
                                data={{
                                    labels: dados.map((d) => d.label),
                                    datasets: [{
                                        data: dados.map((d) => d.value),
                                        colors: [
                                            (opacity = 1) => `rgba(32, 114, 38, ${opacity})`,
                                            (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,
                                            (opacity = 1) => `rgba(255, 175, 50, ${opacity})`,
                                        ]
                                    }],
                                }}
                                width={Dimensions.get("window").width * 0.5}
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
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ marginTop: 20, color: "#666", fontSize: 20, alignItems: 'center' }}>Selecione o período e gere o gráfico.</Text>
                    </View>
                )}


            </View>
        </SafeAreaView>
    )
}