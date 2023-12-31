import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Home from '../screens/Home';
import Cart from '../screens/Cart';
import Favourite from '../screens/Favourite';
import ProfileNavigator from './ProfileNavigator';
import Notification from '../screens/Notification';
import GlobalStyles from '../untils/GlobalStyles';

const Tab = createBottomTabNavigator();

function BottomTabs() {
    const cartItemQuantity = useSelector((state) => state.cartReducer.cart.length);
    const favouriteQuantity = useSelector((state) => state.favorReducer.favorites.length);
    const notiCount = useSelector((state) => state.notifications.notifications.length);

    return (
        <Tab.Navigator
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: GlobalStyles.primaryColor,
                tabBarInactiveTintColor: '#000',
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                    fontWeight: '600',
                },
                tabBarStyle: {
                    padding: 8,
                    height: 60,
                    backgroundColor: '#e6f9ff',
                },
            }}
        >
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={focused ? GlobalStyles.primaryColor : '#000'}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="favourite"
                component={Favourite}
                options={{
                    tabBarLabel: 'Favourites',
                    tabBarIcon: ({ focused }) => {
                        return (
                            <FontAwesome
                                name={focused ? 'heart' : 'heart-o'}
                                size={22}
                                color={focused ? GlobalStyles.primaryColor : '#000'}
                            />
                        );
                    },
                    tabBarBadge: favouriteQuantity,
                    tabBarBadgeStyle: {
                        display: favouriteQuantity ? 'flex' : 'none',
                    },
                    headerTitle: 'Favourites',
                }}
            />
            <Tab.Screen
                name="cart"
                component={Cart}
                options={{
                    tabBarLabel: 'Cart',
                    headerTitle: 'My Cart',
                    headerTitleStyle: {
                        fontWeight: '800',
                    },
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name={focused ? 'cart-sharp' : 'cart-outline'}
                                size={28}
                                color={focused ? GlobalStyles.primaryColor : '#000'}
                            />
                        );
                    },
                    tabBarBadge: cartItemQuantity,
                    tabBarBadgeStyle: {
                        display: cartItemQuantity ? 'flex' : 'none',
                    },
                }}
            />
            <Tab.Screen
                name="notification"
                component={Notification}
                options={({ route }) => ({
                    tabBarLabel: 'Notifications',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? 'notifications' : 'notifications-outline'}
                            size={26}
                            color={focused ? GlobalStyles.primaryColor : '#000'}
                        />
                    ),
                    tabBarBadge: notiCount > 0 ? notiCount : null,
                })}
            />
            <Tab.Screen
                name="profile"
                component={ProfileNavigator}
                options={{
                    tabBarLabel: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <FontAwesome
                                name={focused ? 'user' : 'user-o'}
                                size={22}
                                color={focused ? GlobalStyles.primaryColor : '#000'}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomTabs;
