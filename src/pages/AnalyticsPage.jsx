import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Autocomplete,
    TextField,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    ScatterChart,
    Scatter,
    ZAxis,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import api from '../services/api';
import AnalyticsIcon from '@mui/icons-material/AnalyticsRounded';
import GroupIcon from '@mui/icons-material/GroupRounded';
import PublicIcon from '@mui/icons-material/PublicRounded';
import BusinessIcon from '@mui/icons-material/BusinessRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';

import SummaryCard from '../components/Analytics/SummaryCard';
import ChartCard from '../components/Analytics/ChartCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#4ECDC4'];

const AnalyticsPage = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    // Filters
    const [availableDepartments, setAvailableDepartments] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);

    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);

    // Data
    const [summary, setSummary] = useState(null);
    const [countryData, setCountryData] = useState([]);
    const [employerData, setEmployerData] = useState([]);
    const [skillData, setSkillData] = useState([]);
    const [designationData, setDesignationData] = useState([]);
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedDepartments, selectedYears]);

    const fetchInitialData = async () => {
        try {
            // Fetch Departments for filter
            const deptRes = await api.get('/analytics/departments');
            setAvailableDepartments(deptRes.data || []);

            // Fetch Batch Trends to get available years for filter
            // We can use the generic batch-trends endpoint initially without filters to get all years
            const trendsRes = await api.get('/analytics/batch-trends');
            const years = trendsRes.data.map(item => item.year).filter(y => y);
            setAvailableYears(years);
        } catch (error) {
            console.error("Error fetching initial data", error);
        }
    };

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedDepartments.length > 0) {
                params.append('department', selectedDepartments.join(','));
            }
            if (selectedYears.length > 0) {
                params.append('graduationYear', selectedYears.join(','));
            }

            const queryString = params.toString();

            const [summaryRes, countriesRes, employersRes, skillsRes, designationsRes, trendsRes] = await Promise.all([
                api.get(`/analytics/summary?${queryString}`),
                api.get(`/analytics/countries?${queryString}`),
                api.get(`/analytics/employers?${queryString}`),
                api.get(`/analytics/skills?${queryString}`),
                api.get(`/analytics/designations?${queryString}`),
                api.get(`/analytics/batch-trends?${queryString}`)
            ]);

            setSummary(summaryRes.data);
            setCountryData(countriesRes.data);
            setEmployerData(employersRes.data);
            setSkillData(skillsRes.data);
            setDesignationData(designationsRes.data);
            setTrendData(trendsRes.data);

        } catch (error) {
            console.error("Error fetching analytics", error);
        } finally {
            setLoading(false);
        }
    };

    // Transform skill data for bubble chart
    const bubbleData = skillData.map((skill, index) => ({
        ...skill,
        x: (index % 3) + 1,
        y: Math.floor(index / 3) + 1,
        z: skill.value,
        fill: COLORS[index % COLORS.length]
    }));

    const BubbleTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid #ccc', borderRadius: 1, boxShadow: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{data.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Count: {data.value}</Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-1px' }}>
                        Analytics Dashboard
                    </Typography>
                    <Typography color="text.secondary">
                        Insights into alumni distribution, skills, and career trends
                    </Typography>
                </Box>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Autocomplete
                    multiple
                    options={availableYears}
                    value={selectedYears}
                    onChange={(event, newValue) => setSelectedYears(newValue)}
                    renderInput={(params) => <TextField {...params} label="Graduation Year" placeholder="Select Years" />}
                    sx={{ minWidth: 250, flexGrow: 1 }}
                />
                <Autocomplete
                    multiple
                    options={availableDepartments}
                    value={selectedDepartments}
                    onChange={(event, newValue) => setSelectedDepartments(newValue)}
                    renderInput={(params) => <TextField {...params} label="Department" placeholder="Select Departments" />}
                    sx={{ minWidth: 250, flexGrow: 1 }}
                />
            </Paper>

            {loading && !summary ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Total Alumni" value={summary?.totalAlumni} icon={<GroupIcon fontSize="large" />} color="#2196f3" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Global Reach" value={summary?.globalReach} icon={<PublicIcon fontSize="large" />} color="#4caf50" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Companies" value={summary?.corporateFootprint} icon={<BusinessIcon fontSize="large" />} color="#ff9800" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <SummaryCard title="Skill Velocity" value={summary?.skillVelocity} icon={<TrendingUpIcon fontSize="large" />} color="#f44336" />
                        </Grid>
                    </Grid>

                    {/* Charts Row 1 */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {/* Batch Trends */}
                        <Grid item xs={12}>
                            <ChartCard title="Alumni Growth vs Batch" height={500}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#2196f3" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </Grid>

                        <Grid item xs={12}>
                            <ChartCard title="Global Distribution" height={500}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={countryData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={160}
                                            paddingAngle={5}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {countryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </Grid>
                    </Grid>

                    {/* Charts Row 2 */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <ChartCard title="Top Employers" height={500}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={employerData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 13 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" fill="#ff9800" radius={[0, 4, 4, 0]} barSize={25} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </Grid>

                        {/* Top Skills */}
                        <Grid item xs={12} >
                            <ChartCard title="Top Skills" height={500} sx={{ maxWidth: 680, mx: 'auto' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <XAxis type="number" dataKey="x" hide />
                                        <YAxis type="number" dataKey="y" hide />
                                        <ZAxis type="number" dataKey="z" range={[100, 1500]} name="count" />
                                        <Tooltip content={<BubbleTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                        <Scatter name="Skills" data={bubbleData} fill="#8884d8">
                                            {bubbleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </Grid>

                        {/* Top Designations */}
                        <Grid item xs={12} >
                            <ChartCard title="Common Designations" height={500}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={designationData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 13 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" fill="#9c27b0" radius={[0, 4, 4, 0]} barSize={25} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </Grid>
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default AnalyticsPage;
